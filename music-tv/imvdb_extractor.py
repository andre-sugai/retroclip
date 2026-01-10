#!/usr/bin/env python3
"""
IMVDB Video Clip Extractor
Busca videoclipes por ano utilizando a API do IMVDB e enriquece com dados do Discogs
"""

import requests
import json
import csv
import time
from typing import List, Dict, Optional
from urllib.parse import quote

# Configuração das APIs - Adicione suas chaves aqui
IMVDB_API_KEY = "tlwzyv5nkAyeBJzu7khW2SJTF9pXxuIz2lrvsVOb"  # Registre em https://imvdb.com/developers
DISCOGS_TOKEN = "DioHrUoduGWGlcLhHCiXcVznlGGbrNUrYQXVkPZI"  # Gere em https://www.discogs.com/settings/developers

# URLs base das APIs
IMVDB_BASE_URL = "https://imvdb.com/api/v1"
DISCOGS_BASE_URL = "https://api.discogs.com"

# Cache para evitar chamadas duplicadas à API do Discogs
artist_genre_cache = {}


def get_imvdb_headers():
    """Retorna headers para requisições IMVDB"""
    return {
        "IMVDB-APP-KEY": IMVDB_API_KEY,
        "Accept": "application/json"
    }


def get_discogs_headers():
    """Retorna headers para requisições Discogs"""
    return {
        "Authorization": f"Discogs token={DISCOGS_TOKEN}",
        "User-Agent": "IMVDBExtractor/1.0"
    }


def search_videos_by_year(year: int, page: int = 1, per_page: int = 100) -> Dict:
    """
    Busca vídeos no IMVDB por ano
    Nota: A API do IMVDB usa busca por texto, então buscamos pelo ano
    """
    url = f"{IMVDB_BASE_URL}/search/videos"
    params = {
        "q": str(year),
        "page": page,
        "per_page": per_page
    }
    
    try:
        response = requests.get(url, headers=get_imvdb_headers(), params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar vídeos: {e}")
        return {"results": [], "total_pages": 0}


def get_video_details(video_id: str) -> Optional[Dict]:
    """Busca detalhes de um vídeo específico incluindo fontes (YouTube)"""
    url = f"{IMVDB_BASE_URL}/video/{video_id}"
    params = {"include": "sources"}
    
    try:
        response = requests.get(url, headers=get_imvdb_headers(), params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar detalhes do vídeo {video_id}: {e}")
        return None


def get_artist_genre_from_discogs(artist_name: str) -> str:
    """Busca o gênero musical do artista no Discogs"""
    # Verifica cache
    if artist_name in artist_genre_cache:
        return artist_genre_cache[artist_name]
    
    # Rate limiting - Discogs permite 60 req/min para usuários autenticados
    time.sleep(1.1)
    
    url = f"{DISCOGS_BASE_URL}/database/search"
    params = {
        "q": artist_name,
        "type": "artist",
        "per_page": 1
    }
    
    try:
        response = requests.get(url, headers=get_discogs_headers(), params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get("results"):
            genres = data["results"][0].get("genre", [])
            styles = data["results"][0].get("style", [])
            
            # Combina gêneros e estilos
            all_genres = genres + styles
            genre_str = ", ".join(all_genres) if all_genres else "Desconhecido"
            
            # Salva no cache
            artist_genre_cache[artist_name] = genre_str
            return genre_str
        
        artist_genre_cache[artist_name] = "Desconhecido"
        return "Desconhecido"
        
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar gênero para {artist_name}: {e}")
        artist_genre_cache[artist_name] = "Erro na API"
        return "Erro na API"


def get_youtube_link(sources: List[Dict]) -> str:
    """Extrai o link do YouTube das fontes do vídeo"""
    if not sources:
        return ""
    
    for source in sources:
        if source.get("source") == "youtube":
            video_id = source.get("source_data")
            if video_id:
                return f"https://www.youtube.com/watch?v={video_id}"
    
    return ""


def collect_videos_by_year(year: int) -> List[Dict]:
    """Coleta todos os vídeos de um determinado ano"""
    print(f"\nBuscando vídeos de {year}...")
    all_videos = []
    page = 1
    
    while True:
        print(f"Buscando página {page}...")
        data = search_videos_by_year(year, page)
        results = data.get("results", [])
        
        if not results:
            break
        
        # Filtra vídeos que realmente são do ano solicitado
        for video in results:
            if video.get("year") == year:
                all_videos.append(video)
        
        # Verifica se há mais páginas
        if page >= data.get("total_pages", 0):
            break
        
        page += 1
        time.sleep(0.5)  # Rate limiting para IMVDB
    
    print(f"Total de vídeos encontrados: {len(all_videos)}")
    return all_videos


def enrich_with_details(videos: List[Dict]) -> List[Dict]:
    """Enriquece os vídeos com detalhes adicionais (YouTube links)"""
    enriched = []
    total = len(videos)
    
    print(f"\nBuscando detalhes e links do YouTube para {total} vídeos...")
    
    for i, video in enumerate(videos, 1):
        print(f"Processando {i}/{total}: {video.get('song_title')}...", end="\r")
        
        # Busca detalhes do vídeo
        details = get_video_details(video.get("id"))
        
        if details:
            youtube_link = get_youtube_link(details.get("sources", []))
            video["youtube_link"] = youtube_link
        else:
            video["youtube_link"] = ""
        
        enriched.append(video)
        time.sleep(0.5)  # Rate limiting
    
    print()
    return enriched


def add_artist_genres(videos: List[Dict]) -> List[Dict]:
    """Adiciona informações de gênero musical dos artistas usando Discogs"""
    total = len(videos)
    
    print(f"\nBuscando categorias musicais no Discogs para {total} vídeos...")
    
    for i, video in enumerate(videos, 1):
        artists = video.get("artists", [])
        
        if artists:
            artist_name = artists[0].get("name", "")
            print(f"Processando {i}/{total}: {artist_name}...", end="\r")
            
            genre = get_artist_genre_from_discogs(artist_name)
            video["artist_genre"] = genre
        else:
            video["artist_genre"] = "Desconhecido"
    
    print()
    return videos


def save_to_json(videos: List[Dict], filename: str):
    """Salva os dados em formato JSON"""
    output = []
    
    for video in videos:
        artists = video.get("artists", [])
        artist_name = artists[0].get("name", "") if artists else ""
        
        output.append({
            "artist": artist_name,
            "song_title": video.get("song_title", ""),
            "year": video.get("year", ""),
            "artist_genre": video.get("artist_genre", "Desconhecido"),
            "youtube_link": video.get("youtube_link", ""),
            "imvdb_url": video.get("url", "")
        })
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nDados salvos em {filename}")


def save_to_csv(videos: List[Dict], filename: str):
    """Salva os dados em formato CSV"""
    if not videos:
        print("Nenhum dado para salvar.")
        return
    
    with open(filename, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["artist", "song_title", "year", "artist_genre", "youtube_link", "imvdb_url"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for video in videos:
            artists = video.get("artists", [])
            artist_name = artists[0].get("name", "") if artists else ""
            
            writer.writerow({
                "artist": artist_name,
                "song_title": video.get("song_title", ""),
                "year": video.get("year", ""),
                "artist_genre": video.get("artist_genre", "Desconhecido"),
                "youtube_link": video.get("youtube_link", ""),
                "imvdb_url": video.get("url", "")
            })
    
    print(f"\nDados salvos em {filename}")


def main():
    print("=" * 60)
    print("IMVDB Video Clip Extractor")
    print("=" * 60)
    
    # Verifica se as chaves da API estão configuradas
    if IMVDB_API_KEY == "SUA_CHAVE_IMVDB_AQUI":
        print("\n⚠️  ATENÇÃO: Configure sua chave da API do IMVDB no script!")
        print("Registre-se em: https://imvdb.com/developers")
        return
    
    if DISCOGS_TOKEN == "SEU_TOKEN_DISCOGS_AQUI":
        print("\n⚠️  ATENÇÃO: Configure seu token do Discogs no script!")
        print("Gere em: https://www.discogs.com/settings/developers")
        return
    
    # Solicita o ano
    while True:
        try:
            year = int(input("\nDigite o ano que deseja pesquisar (ex: 2024): "))
            if 1900 <= year <= 2030:
                break
            print("Por favor, digite um ano válido entre 1900 e 2030.")
        except ValueError:
            print("Por favor, digite um número válido.")
    
    # Solicita o formato de saída
    print("\nFormatos de saída disponíveis:")
    print("1. JSON")
    print("2. CSV")
    print("3. Ambos")
    
    while True:
        output_choice = input("\nEscolha o formato de saída (1/2/3): ").strip()
        if output_choice in ["1", "2", "3"]:
            break
        print("Opção inválida. Por favor, escolha 1, 2 ou 3.")
    
    # Coleta os vídeos
    videos = collect_videos_by_year(year)
    
    if not videos:
        print("\nNenhum vídeo encontrado para o ano especificado.")
        return
    
    # Enriquece com detalhes (YouTube links)
    videos = enrich_with_details(videos)
    
    # Adiciona gêneros dos artistas do Discogs
    videos = add_artist_genres(videos)
    
    # Salva os arquivos
    base_filename = f"videoclips_{year}"
    
    if output_choice in ["1", "3"]:
        save_to_json(videos, f"{base_filename}.json")
    
    if output_choice in ["2", "3"]:
        save_to_csv(videos, f"{base_filename}.csv")
    
    print("\n✅ Processo concluído com sucesso!")
    print(f"Total de videoclipes processados: {len(videos)}")


if __name__ == "__main__":
    main()
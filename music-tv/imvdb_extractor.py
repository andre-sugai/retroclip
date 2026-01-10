#!/usr/bin/env python3
"""
IMVDb Video Extractor
Extrai videoclipes de um ano específico usando a API do IMVDb
"""

import requests
import json
import csv
import sys
from typing import List, Dict, Optional
from datetime import datetime

# Configuração da API
API_KEY = "tlwzyv5nkAyeBJzu7khW2SJTF9pXxuIz2lrvsVOb"  # Substitua pela sua chave API do IMVDb
BASE_URL = "https://imvdb.com/api/v1"
HEADERS = {
    "IMVDB-APP-KEY": API_KEY,
    "Accept": "application/json"
}


def get_video_sources(video_id: str) -> Optional[str]:
    """Obtém o link do YouTube para um vídeo específico"""
    try:
        url = f"{BASE_URL}/video/{video_id}?include=sources"
        response = requests.get(url, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            if "sources" in data:
                for source in data["sources"]:
                    if source.get("source") == "youtube" and source.get("is_primary"):
                        youtube_id = source.get("source_data")
                        return f"https://www.youtube.com/watch?v={youtube_id}"
        return None
    except Exception as e:
        print(f"Erro ao buscar fonte do vídeo {video_id}: {e}")
        return None


def search_videos_by_year(year: int) -> List[Dict]:
    """Busca todos os videoclipes de um ano específico"""
    all_videos = []
    page = 1
    
    print(f"\nBuscando videoclipes de {year}...")
    
    while True:
        try:
            # A API do IMVDb permite busca por ano através de search
            url = f"{BASE_URL}/search/videos"
            params = {
                "q": str(year),
                "page": page,
                "per_page": 50
            }
            
            response = requests.get(url, headers=HEADERS, params=params)
            
            if response.status_code == 403:
                print("\n❌ Erro: Chave API inválida ou não configurada!")
                print("Por favor, edite o script e adicione sua chave API do IMVDb.")
                print("Você pode obter uma chave em: https://imvdb.com/developers/apps/new")
                sys.exit(1)
            
            if response.status_code != 200:
                print(f"\nErro na requisição: Status {response.status_code}")
                break
            
            data = response.json()
            results = data.get("results", [])
            
            # Filtrar apenas vídeos do ano específico
            year_videos = [v for v in results if v.get("year") == year]
            
            if not year_videos:
                break
            
            all_videos.extend(year_videos)
            
            print(f"  Página {page}: {len(year_videos)} vídeos encontrados")
            
            # Verificar se há mais páginas
            total_pages = data.get("total_pages", 1)
            if page >= total_pages:
                break
                
            page += 1
            
        except Exception as e:
            print(f"Erro ao buscar vídeos: {e}")
            break
    
    print(f"\n✓ Total de videoclipes encontrados: {len(all_videos)}")
    return all_videos


def process_videos(videos: List[Dict]) -> List[Dict]:
    """Processa os vídeos e adiciona informações adicionais"""
    processed = []
    total = len(videos)
    
    print("\nProcessando vídeos e buscando links do YouTube...")
    
    for idx, video in enumerate(videos, 1):
        print(f"  Processando {idx}/{total}...", end="\r")
        
        # Extrair informações básicas
        video_data = {
            "id": video.get("id"),
            "song_title": video.get("song_title"),
            "year": video.get("year"),
            "artist_name": "",
            "artist_genre": "Desconhecido",  # Padrão
            "youtube_link": None,
            "imvdb_url": video.get("url")
        }
        
        # Extrair nome do artista
        artists = video.get("artists", [])
        if artists:
            video_data["artist_name"] = artists[0].get("name", "")
        
        # Buscar link do YouTube
        video_id = video.get("id")
        if video_id:
            youtube_link = get_video_sources(str(video_id))
            video_data["youtube_link"] = youtube_link
        
        processed.append(video_data)
    
    print(f"\n✓ Processamento concluído!")
    return processed


def save_to_json(data: List[Dict], year: int):
    """Salva os dados em formato JSON"""
    filename = f"videoclips_{year}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Arquivo JSON salvo: {filename}")


def save_to_csv(data: List[Dict], year: int):
    """Salva os dados em formato CSV"""
    filename = f"videoclips_{year}.csv"
    
    if not data:
        print("Nenhum dado para salvar!")
        return
    
    # Definir campos do CSV
    fieldnames = ["id", "song_title", "artist_name", "year", "artist_genre", "youtube_link", "imvdb_url"]
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    print(f"✓ Arquivo CSV salvo: {filename}")


def main():
    """Função principal"""
    print("=" * 60)
    print("IMVDb Video Extractor")
    print("=" * 60)
    
    # Solicitar ano
    while True:
        try:
            year_input = input("\nDigite o ano desejado (ex: 2023): ").strip()
            year = int(year_input)
            
            if year < 1900 or year > datetime.now().year:
                print(f"Por favor, digite um ano entre 1900 e {datetime.now().year}")
                continue
            break
        except ValueError:
            print("Por favor, digite um ano válido!")
    
    # Solicitar formato de saída
    while True:
        format_input = input("\nFormato de saída (JSON/CSV): ").strip().upper()
        if format_input in ["JSON", "CSV"]:
            output_format = format_input
            break
        print("Por favor, escolha JSON ou CSV")
    
    # Buscar vídeos
    videos = search_videos_by_year(year)
    
    if not videos:
        print("\n❌ Nenhum videoclipe encontrado para este ano.")
        sys.exit(0)
    
    # Processar vídeos
    processed_videos = process_videos(videos)
    
    # Salvar no formato escolhido
    if output_format == "JSON":
        save_to_json(processed_videos, year)
    else:
        save_to_csv(processed_videos, year)
    
    print("\n" + "=" * 60)
    print("Extração concluída com sucesso!")
    print("=" * 60)


if __name__ == "__main__":
    main()
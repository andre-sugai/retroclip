import { supabase } from '../lib/supabaseClient';
import { Channel, Episode, EpisodeItem } from '../types';

// CHANNELS
export const fetchChannels = async (userId: string): Promise<Channel[]> => {
  const { data, error } = await supabase
    .from('channels' as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as any) || [];
};

export const createChannel = async (userId: string, title: string, description?: string): Promise<Channel> => {
  const { data, error } = await supabase
    .from('channels' as any)
    .insert([{ user_id: userId, title, description }])
    .select()
    .single();

  if (error) throw error;
  return data as any;
};

export const deleteChannel = async (channelId: string) => {
  const { error } = await supabase.from('channels' as any).delete().eq('id', channelId);
  if (error) throw error;
};

// EPISODES
export const fetchEpisodes = async (channelId: string): Promise<Episode[]> => {
  const { data, error } = await supabase
    .from('episodes' as any)
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as any) || [];
};

export const createEpisode = async (
  channelId: string,
  title: string,
  opening_video_url?: string,
  intro_video_url?: string
): Promise<Episode> => {
  const { data, error } = await supabase
    .from('episodes' as any)
    .insert([{ channel_id: channelId, title, opening_video_url, intro_video_url }])
    .select()
    .single();

  if (error) throw error;
  return data as any;
};

export const deleteEpisode = async (episodeId: string) => {
  const { error } = await supabase.from('episodes' as any).delete().eq('id', episodeId);
  if (error) throw error;
};

// EPISODE ITEMS
export const fetchEpisodeItems = async (episodeId: string): Promise<EpisodeItem[]> => {
  const { data, error } = await supabase
    .from('episode_items' as any)
    .select('*')
    .eq('episode_id', episodeId)
    .order('order', { ascending: true });

  if (error) throw error;
  return (data as any) || [];
};

export const addEpisodeItem = async (episodeId: string, videoUrl: string, order: number): Promise<EpisodeItem> => {
    // If order is not provided (or we want to append), we might need to fetch max order first.
    // For now, assuming caller handles order.
  const { data, error } = await supabase
    .from('episode_items' as any)
    .insert([{ episode_id: episodeId, video_url: videoUrl, order }])
    .select()
    .single();

  if (error) throw error;
  return data as any;
};

export const deleteEpisodeItem = async (itemId: string) => {
  const { error } = await supabase.from('episode_items' as any).delete().eq('id', itemId);
  if (error) throw error;
};

export const updateEpisodeItems = async (episodeId: string, items: { video_url: string; order: number }[]) => {
  // 1. Delete existing items
  const { error: deleteError } = await supabase
    .from('episode_items' as any)
    .delete()
    .eq('episode_id', episodeId);
  
  if (deleteError) throw deleteError;

  // 2. Insert new items
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      episode_id: episodeId,
      video_url: item.video_url,
      order: item.order
    }));

    const { error: insertError } = await supabase
      .from('episode_items' as any)
      .insert(itemsToInsert);
    
    if (insertError) throw insertError;
  }
};

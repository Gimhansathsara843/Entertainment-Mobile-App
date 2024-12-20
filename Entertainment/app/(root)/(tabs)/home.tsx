import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Linking 
} from 'react-native';

type SongItem = {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number;
  preview: string;
  selected: boolean;
};

const HomePage = () => {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending tracks on initial load
  useEffect(() => {
    fetchTrendingTracks();
  }, []);

  const fetchTrendingTracks = async () => {
    try {
      const response = await fetch(
        'https://api.deezer.com/chart/0/tracks?limit=50'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedSongs: SongItem[] = data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        imageUrl: track.album.cover_medium || 'https://via.placeholder.com/150',
        duration: track.duration,
        preview: track.preview,
        selected: false,
      }));

      setSongs(formattedSongs);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setError('Failed to fetch trending tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async (query: string) => {
    if (!query.trim()) {
      fetchTrendingTracks();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=50`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedSongs: SongItem[] = data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        imageUrl: track.album.cover_medium || 'https://via.placeholder.com/150',
        duration: track.duration,
        preview: track.preview,
        selected: false,
      }));

      setSongs(formattedSongs);
    } catch (error) {
      console.error('Error searching songs:', error);
      setError('Failed to search songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSongs(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleSongSelection = (id: string) => {
    setSongs(prevSongs => {
      const newSongs = prevSongs.map(song => {
        if (song.id === id) {
          return { ...song, selected: !song.selected };
        }
        return song;
      });
      
      const newSelectedCount = newSongs.filter(song => song.selected).length;
      setSelectedCount(newSelectedCount);
      
      return newSongs;
    });
  };

  const renderItem = ({ item }: { item: SongItem }) => (
    <View style={styles.item}>
      <TouchableOpacity 
        style={styles.songContent}
        onPress={() => {
          // Play preview when clicking the song
          if (item.preview) {
            Linking.openURL(item.preview);
          }
        }}
      >
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.songImage}
          onError={() => {
            console.log('Image loading error for song:', item.title);
          }}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
          <Text style={styles.albumName} numberOfLines={1}>{item.album}</Text>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectButton, item.selected && styles.selectedButton]}
        onPress={() => toggleSongSelection(item.id)}
      >
        <Text style={styles.selectButtonText}>
          {item.selected ? '✓' : '+'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search songs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery.trim() ? 'No songs found.' : 'Start typing to search for songs.'}
            </Text>
          }
        />
      )}

      {selectedCount > 0 && (
        <View style={styles.floatingCounter}>
          <Text style={styles.counterText}>
            Selected: {selectedCount}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          // Handle playing selected songs
          const selectedSongs = songs.filter(song => song.selected);
          if (selectedSongs.length > 0 && selectedSongs[0].preview) {
            Linking.openURL(selectedSongs[0].preview);
          }
        }}
      >
        <Text style={styles.fabIcon}>▶</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: 'center',
  },
  songContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  songInfo: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  selectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  selectButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  floatingCounter: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 16,
    elevation: 4,
  },
  counterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default HomePage;
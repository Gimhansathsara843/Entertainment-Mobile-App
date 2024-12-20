import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';

type Artist = {
  id: string;
  name: string;
  imageUrl: string;
  numFans: number;
  numAlbums: number;
};

const ExplorePage = () => {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch top artists on initial load
  useEffect(() => {
    fetchTopArtists();
  }, []);

  const fetchTopArtists = async () => {
    try {
      const response = await fetch('https://api.deezer.com/chart/0/artists');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedArtists: Artist[] = data.data.map((artist: any) => ({
        id: artist.id.toString(),
        name: artist.name,
        imageUrl: artist.picture_medium || 'https://via.placeholder.com/150',
        numFans: artist.nb_fan || 0,
        numAlbums: artist.nb_album || 0,
      }));

      setArtists(formattedArtists);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Failed to fetch artists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchArtists = async (query: string) => {
    if (!query.trim()) {
      fetchTopArtists();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedArtists: Artist[] = data.data.map((artist: any) => ({
        id: artist.id.toString(),
        name: artist.name,
        imageUrl: artist.picture_medium || 'https://via.placeholder.com/150',
        numFans: artist.nb_fan || 0,
        numAlbums: artist.nb_album || 0,
      }));

      setArtists(formattedArtists);
    } catch (error) {
      console.error('Error searching artists:', error);
      setError('Failed to search artists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchArtists(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleArtistPress = (artistId: string, artistName: string) => {
    // Navigate to home page with artist search query
    router.push({
      pathname: '/home',
      params: { 
        search: `artist:"${artistName}"`,
        artistId: artistId
      }
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity 
      style={styles.artistCard}
      onPress={() => handleArtistPress(item.id, item.name)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.artistImage}
      />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {formatNumber(item.numFans)} fans
          </Text>
          <Text style={styles.statsText}>
            {formatNumber(item.numAlbums)} albums
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Artists</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search artists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery.trim() ? 'No artists found.' : 'Start typing to search for artists.'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  artistCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    maxWidth: '47%',
  },
  artistImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
  },
  artistInfo: {
    padding: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    color: '#757575',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
    marginTop: 32,
    paddingHorizontal: 16,
  },
});

export default ExplorePage;
import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepository] = useState([]);

  useEffect(() => {
      api.get('repositories').then(response => {
      //console.log(response.data);
      setRepository(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data
    console.log(`liked response ${likedRepository.title}`);

    const repositoriesUpdate = repositories.map(repo => {
      if (repo.id === id) {
        console.log(`return liked repo ${likedRepository.title}`);
        return likedRepository;
      } else {
        return repo;
      }
    });

    setRepository(repositoriesUpdate);
    console.log(`repo updated ${repositoriesUpdate}`);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF7B10" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repo}) => (
            <>
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repo.title}</Text>

                <View style={styles.techsContainer}>
                  {repo.techs.map(tech => (
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text 
                    style={styles.likeText}
                    testID={`repository-likes-${repo.id}`}
                  >
                    {repo.likes} curtida{repo.likes > 1 ? 's' : ''}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repo.id)}
                  testID={`like-button-${repo.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF7B10",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#FF7B10",
    padding: 15,
    borderRadius: 8,
  },
});

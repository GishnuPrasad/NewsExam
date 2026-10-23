import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'https://api.sampleapis.com/futurama/episodes'

export const fetchEpisodes = createAsyncThunk(
  'episodes/fetchEpisodes',
  async () => {
    const result = await axios.get(API_URL)
    return result.data
  },
)

export function getEpisodeKey(episode) {
  return String(episode.id ?? `${episode.number}-${episode.title}`)
}

function filterEpisodes(episodes, searchTerm) {
  const searchText = searchTerm.trim().toLowerCase()

  if (!searchText) {
    return episodes
  }

  return episodes.filter(
    (episode) =>
      episode.title?.toLowerCase().includes(searchText) ||
      episode.desc?.toLowerCase().includes(searchText),
  )
}

const episodesSlice = createSlice({
  name: 'episodes',
  initialState: {
    allEpisodes: [],
    allEpisodesDummy: [],
    searchTerm: '',
    error: '',
    loading: false,
    hasLoaded: false,
  },
  reducers: {
    searchEpisode: (state, action) => {
      state.searchTerm = action.payload
      state.allEpisodes = filterEpisodes(state.allEpisodesDummy, action.payload)
    },
    updateEpisode: (state, action) => {
      const { id, changes } = action.payload
      state.allEpisodesDummy = state.allEpisodesDummy.map((episode) =>
        getEpisodeKey(episode) === id ? { ...episode, ...changes } : episode,
      )
      state.allEpisodes = filterEpisodes(state.allEpisodesDummy, state.searchTerm)
    },
    deleteEpisode: (state, action) => {
      state.allEpisodesDummy = state.allEpisodesDummy.filter(
        (episode) => getEpisodeKey(episode) !== action.payload,
      )
      state.allEpisodes = filterEpisodes(state.allEpisodesDummy, state.searchTerm)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.allEpisodes = []
        state.allEpisodesDummy = []
        state.error = ''
        state.loading = true
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.allEpisodesDummy = action.payload
        state.allEpisodes = filterEpisodes(action.payload, state.searchTerm)
        state.loading = false
        state.hasLoaded = true
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.allEpisodes = []
        state.allEpisodesDummy = []
        state.loading = false
        state.hasLoaded = true
        state.error = action.error.message || 'API request failed.'
      })
  },
})

export const { searchEpisode, updateEpisode, deleteEpisode } = episodesSlice.actions
export default episodesSlice.reducer

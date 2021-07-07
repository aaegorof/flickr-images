import axios from 'axios'

const API_KEY = 'ef1f9d4f8ca80dada31c684364355282'
const FLICKR_SIG = 'd7f57fa9e01a6a2d6ccd8597b8d2f86b'

export const CONSTRUCT_BASE_URL = 'https://live.staticflickr.com/'

export const flickrApi = axios.create({
  baseURL: 'https://www.flickr.com/services/rest',
  params: {
    api_key: API_KEY,
    FLickrApi_sig: FLICKR_SIG,
    format: 'json',
    nojsoncallback: 1,
    extras: 'owner_name,date_upload',
  },
})

export const getFlickrImages = (searchText: string, rest?: any) =>
  flickrApi.get('', {
    params: { method: 'flickr.photos.search', text: searchText, ...rest },
  })

export const getImage = (id: string, secret: string) =>
  flickrApi.get('', {
    params: { method: 'flickr.photos.getInfo', photo_id: id, secret },
  })

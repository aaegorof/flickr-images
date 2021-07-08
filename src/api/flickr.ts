import axios from 'axios'
import { API_KEY, FLICKR_SIG } from '../constants'

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

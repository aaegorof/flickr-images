import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import { CONSTRUCT_BASE_URL, getFlickrImages } from '../../api/flickr'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import './imageList.scss'
import {useDebounce} from "react-use";
import {Link, useHistory, useLocation} from 'react-router-dom'

type Props = {}

const ImageList: React.FC<Props> = (props) => {
  const query = new URLSearchParams(useLocation().search)

  const [search, setSearch] = useState(query.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [, cancel] = useDebounce(
      () => {
        setDebouncedSearch(search);
      },
      300,
      [search]
  );

  let history = useHistory();


  useEffect(()=>{
    if(search){
      history.push('/images' + `?search=${search}`)
    } else {
      history.push('/images')
    }
  }, [search])

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'imageList'+ debouncedSearch,
    async ({ pageParam = 0 }) => {
      const res = await getFlickrImages(debouncedSearch, { page: pageParam })
      if(res.data.stat !=='ok') {
        throw new Error(res.data.message)
        return res.data.message
      }
      return res.data
    },
    {
      getPreviousPageParam: (firstPage) => {
        if(!firstPage?.photos) return
        const { page } = firstPage?.photos
        const hasPreviousPage = page < 2
        return hasPreviousPage ? page - 1 : undefined
      },
      getNextPageParam: (firstPage) => {
        if(!firstPage?.photos) return
        const { page, perpage, total } = firstPage?.photos
        const hasNextPage = page * perpage < total
        return hasNextPage ? page + 1 : undefined
      },
    }
  )

  const loadMoreButtonRef = React.useRef(null)

  // @ts-ignore
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  return (
    <>
      <p>
        <label htmlFor="search-images">Search flickr API</label>
        <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder={'Type to search...'} id={'search-images'} type={'text'}/>
      </p>

      {data?.pages && <div className={'image-list-wrap'}>
        {data?.pages.map((page) => (
          <div className={'image-list'} key={page.id}>
            {page.photos?.photo.map((photo: any) => {
              const imgUrl = `${CONSTRUCT_BASE_URL}${photo.server}/${photo.id}_${photo.secret}.jpg`
              return (
                <div className={'image-item'} key={photo.id}>
                  <Link to={`/edge/${photo.id}`}>
                    <img src={imgUrl} />
                  </Link>
                  <h3>{photo.title}</h3>
                </div>
              )
            })}
          </div>

        ))}
        <button
            ref={loadMoreButtonRef}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className={'load-more-btn'}
        >
          {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                  ? 'Load Newer'
                  : 'Nothing more to load'}
        </button>
      </div>}
    </>
  )
}

export default ImageList

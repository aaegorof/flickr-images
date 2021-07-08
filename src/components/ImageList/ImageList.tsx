import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import { getFlickrImages } from '../../api/flickr'
import { CONSTRUCT_BASE_URL } from '../../constants'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import './imageList.scss'
import { useDebounce } from 'react-use'
import { Link, useHistory, useLocation } from 'react-router-dom'

type Props = {}

const ImageList: React.FC<Props> = () => {
  const query = new URLSearchParams(useLocation().search)

  const [search, setSearch] = useState(query.get('search') || '')
  const [isTopBtnHidden, toggleTopBtnShow] = useState<boolean>(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useDebounce(
    () => {
      setDebouncedSearch(search)
    },
    500,
    [search]
  )

  let history = useHistory()

  useLayoutEffect(() => {
    const scrollWatcher = () => {
      toggleTopBtnShow(window.scrollY < 50)
    }
    scrollWatcher()
    window.addEventListener('scroll', scrollWatcher)
    return () => window.removeEventListener('scroll', scrollWatcher)
  }, [])

  useEffect(() => {
    if (search) {
      history.push(`/images?search=${search}`)
    } else {
      history.push('/images')
    }
  }, [search, history])

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      'imageList' + debouncedSearch,
      async ({ pageParam = 0 }) => {
        const res = await getFlickrImages(debouncedSearch, { page: pageParam })
        if (res.data.stat !== 'ok') {
          throw new Error(res.data.message)
        }
        return res.data
      },
      {
        getPreviousPageParam: (firstPage) => {
          if (!firstPage?.photos) return
          const { page } = firstPage?.photos
          const hasPreviousPage = page < 2
          return hasPreviousPage ? page - 1 : undefined
        },
        getNextPageParam: (firstPage) => {
          if (!firstPage?.photos) return
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
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder={'Type to search...'}
          id={'search-images'}
          type={'text'}
        />
      </p>

      {data?.pages && (
        <div className={'image-list-wrap'}>
          {data?.pages.map((page) => (
            <div className={'image-list'} key={page.photos.page}>
              {page.photos?.photo.map((photo: any) => {
                const imgUrl = `${CONSTRUCT_BASE_URL}${photo.server}/${photo.id}_${photo.secret}.jpg`
                return (
                  <div className={'image-item'} key={photo.id}>
                    <Link to={`/edge/${photo.id}`}>
                      <img src={imgUrl} alt={photo.title}/>
                    </Link>
                    <h4>{photo.title}</h4>
                  </div>
                )
              })}
            </div>
          ))}
          <button
            className={`to-top ${isTopBtnHidden && 'hidden'}`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Top
          </button>
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
        </div>
      )}
    </>
  )
}

export default ImageList

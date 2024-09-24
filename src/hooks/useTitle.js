import React, { useEffect } from 'react'

const useTitle = (title) => {
    useEffect(() => {
        document.title = `Starborn ${title && '|'} ${title}`
    }, [title])
}

export default useTitle;
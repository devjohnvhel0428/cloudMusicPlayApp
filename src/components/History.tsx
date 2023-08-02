import useHistoryStore from '../store/useHistoryStore'
import CommonList from './CommonList/CommonList'
import Loading from './Loading'

const History = () => {
  const [historyList, removeHistory] = useHistoryStore((state) => [state.historyList, state.removeHistory])

  return (
    <>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            handleClickRemove={removeHistory}
          />
      }
    </>
  )
}

export default History
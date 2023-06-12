import { useMemo, useState } from 'react'
import { Box, Container, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { MetaData } from '../../type'
import AudioViewSlider from './AudioViewSlider'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'

const AudioView = ({ player }: { player: HTMLVideoElement }
) => {
  const [playList, index, updateIndex] = usePlayListStore((state) => [
    state.playList,
    state.index,
    state.updateIndex,
  ])

  const [audioViewIsShow, updateAudioViewIsShow, updatePlayListIsShow] = useUiStore((state) => [
    state.audioViewIsShow,
    state.updateAudioViewIsShow,
    state.updatePlayListIsShow,
  ])

  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaDataList] = useMetaDataListStore((state) => [state.metaDataList])

  const [
    playing,
    currentTime,
    duration,
    updatePlaying,
  ] = usePlayerStore(
    (state) => [
      state.playing,
      state.currentTime,
      state.duration,
      state.updatePlaying,
    ]
  )

  useMemo(() => {
    if (playList) {
      const test = metaDataList.filter(metaData => metaData.path === playList[index].path)
      if (test.length === 1) {
        setMetaData({
          ...test[0],
          size: playList[index].size
        })
      } else {
        setMetaData({
          title: playList[index].title,
          artist: '',
          path: playList[index].path,
        })
      }
    }
  }, [index, metaDataList, playList])

  /**
 * 播放暂停
 */
  const handleClickPlayPause = () => {
    if (!isNaN(player.duration)) {
      if (player.paused) {
        player.play()
        updatePlaying(true)
      }
      else {
        player.pause()
        updatePlaying(false)
      }
    }
  }

  /**
  * 下一曲
  */
  const handleClickNext = () => {
    if (index + 1 !== playList?.length) {
      player.pause()
      updateIndex(index + 1)
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (index !== 0) {
      player.pause()
      updateIndex(index - 1)
    }
  }

  /**
 * 点击进度条
 * @param e 
 */
  const handleTimeRangeOnInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target && !isNaN(player.duration)) {
      player.currentTime = player.duration / 1000 * Number(target.value)
      player.play()
      updatePlaying(true)
    }
  }

  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? './cd.png'
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
  }, [playList, metaData])

  // 添加 mediaSession
  useMemo(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: metaData?.title,
      artist: metaData?.artist,
      album: metaData?.album,
      artwork: [{ src: cover }]
    })
    navigator.mediaSession.setActionHandler('play', () => handleClickPlayPause())
    navigator.mediaSession.setActionHandler('pause', () => handleClickPlayPause())
    navigator.mediaSession.setActionHandler('nexttrack', () => handleClickNext())
    navigator.mediaSession.setActionHandler('previoustrack', () => handleClickPrev())
    return () => {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cover, metaData?.album, metaData?.artist, metaData?.title])

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{
          width: '100%',
          height: '100dvh',
          position: 'fixed',
          transition: 'all 0.5s',
          background: `linear-gradient(rgba(180, 180, 180, .5), rgb(180, 180, 180, .5)), url(${cover})  no-repeat center`,
          backgroundSize: 'cover',
          color: '#fff'
        }}
        style={(audioViewIsShow) ? { bottom: '0' } : { bottom: '-100vh' }}
      >
        <Box
          sx={{ backdropFilter: 'blur(25px)', }}
        >
          <Container
            maxWidth={'xl'}
            disableGutters={true}
          >
            <Grid container
              pt={{ xs: 1, sm: 2 }}
              pb={{ xs: 1, sm: 2 }}
              pl={{ xs: 0, sm: 2 }}
              pr={{ xs: 0, sm: 2 }}
              sx={{
                width: '100%',
                height: '100dvh',
                justifyContent: 'space-evenly',
                alignItems: 'start',
              }}
            >

              <Grid xs={6} pl={{ xs: 1, sm: 0 }} >
                <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(false)} >
                  <KeyboardArrowDownOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              <Grid xs={6} pr={{ xs: 1, sm: 0 }} textAlign={'right'}>
                <IconButton aria-label="PlayList" onClick={() => updatePlayListIsShow(true)} >
                  <QueueMusicOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              {/* 封面和音频信息 */}
              <Grid container
                maxWidth={'lg'}
                height={{ xs: 'calc(100dvh - 4rem)', sm: 'auto' }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                wrap='nowrap'
                xs={12}
                sx={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                {/* 封面 */}
                <Grid sm={4} xs={12} pl={{ xs: 0, sm: 1 }}>
                  <img style={{ maxHeight: '100vw', width: '100%', objectFit: 'contain' }} src={cover} />
                </Grid>

                {/* 音频信息 */}
                <Grid
                  sm={8}
                  xs={12}
                  pl={{ xs: 0, lg: 5 }}
                  textAlign={'center'}
                >
                  <Grid xs={12} pl={4} pr={4} >
                    <Typography variant="h6" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.title}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.artist}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.album}
                    </Typography>
                  </Grid>

                  {/* 播放进度条 */}
                  <Grid
                    xs={12}
                    pl={2}
                    pr={2}
                  >
                    <AudioViewSlider
                      handleTimeRangeOnInput={handleTimeRangeOnInput}
                      currentTime={currentTime}
                      duration={duration}
                    />
                  </Grid>

                  <Grid xs={12} >
                    <IconButton aria-label="previous" onClick={handleClickPrev} >
                      <SkipPreviousIcon sx={{ height: 48, width: 48 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="play/pause" onClick={handleClickPlayPause}>
                      {
                        (playing)
                          ? <PauseCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />
                          : <PlayCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />}
                    </IconButton>
                    <IconButton aria-label="next" onClick={handleClickNext} >
                      <SkipNextIcon
                        sx={{ height: 48, width: 48 }}
                        style={{ color: '#fff' }} />
                    </IconButton>
                  </Grid>

                </Grid>
              </Grid>

            </Grid>
          </Container>
        </Box>

      </Container>
    </div >
  )
}

export default AudioView
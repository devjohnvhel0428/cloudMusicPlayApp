import { useMemo } from 'react'
import { Button, Container, Divider, Link, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import SideBar from './components/SideBar'
import Grid from '@mui/material/Unstable_Grid2'
import MobileSideBar from './components/MobileSideBar'
import History from './components/History'
import useUser from './hooks/useUser'

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#8e24aa',
          },
          secondary: {
            main: '#ff3d00',
          },
          error: {
            main: '#ff1744',
          },
        },
      }),
    [prefersDarkMode],
  )

  const { login } = useUser()

  return (
    <main>
      <ThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <AuthenticatedTemplate>
            <div style={{ position: 'absolute', height: 'calc(100dvh - 6rem - 4rem)', width: '100%', top: '4rem', }}>
              <Container maxWidth="xl" disableGutters={true} sx={{ height: '100%' }}>
                <MobileSideBar />
                <Grid container flexDirection={'row'} height={'100%'}  >
                  <Grid xs={0} sm={4} md={3} lg={2} height={'100%'} sx={{ overflowY: 'auto', display: { xs: 'none', sm: 'block' }, }} pb={1} borderRight={`1px solid ${theme.palette.divider}`} borderLeft={`1px solid ${theme.palette.divider}`} >
                    <SideBar />
                    <Divider orientation="vertical" flexItem />
                  </Grid>
                  <Grid xs={12} sm={8} md={9} lg={10} height={'100%'} sx={{ overflowY: 'auto' }} pt={1} pb={3} pl={1} pr={1} borderRight={`1px solid ${theme.palette.divider}`} >
                    <Routes>
                      <Route path='/' element={<ListView />} />
                      <Route path='/history' element={<History />} />
                      <Route path='*' element={<NotFound />} />
                    </Routes>
                  </Grid>
                </Grid>
              </Container>
            </div>
            <Player />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Container
              style={{
                height: 'calc(100dvh)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                textAlign: 'center',
              }}>
              <div>
              </div>
              <div>
                <Typography variant="h5" pb={2} >
                  Please sign in to see your files
                </Typography>
                <Button size="large" onClick={() => login()}>Sign in</Button>
              </div>
              <footer>
                Made with ❤ from <Link underline='none' href='https://github.com/nini22P'>22</Link>
              </footer>
            </Container>
          </UnauthenticatedTemplate>
        </Router>
      </ThemeProvider>
    </main >
  )
}

export default App
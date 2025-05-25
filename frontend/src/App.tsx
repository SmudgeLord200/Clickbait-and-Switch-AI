import { Alert, AlertTitle, Box, Button, CircularProgress, Container, Stack, TextField, Typography, ThemeProvider, CssBaseline } from '@mui/material'
import './App.css'
import { useState, useEffect } from 'react'
import { analyseArticleUrl } from './apiServices/analysisService'
import type { AnalysisResult } from './type'
import LoadingIndicator from './components/LoadingIndicator'
import AnalysisResultCard from './components/AnalysisResultCard'
import { matrixTheme } from './theme'
import { cacheService } from './apiServices/cacheService'
import { getErrorMessage, isValidURL } from './utilities'

const App = () => {
  // State
  const [url, setUrl] = useState("")
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)

  // onChange handler
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // clear previous error if any
    if (error) {
      setError(null)
    }
    // update URL
    setUrl(event.target.value)
  }

  // API Call
  const scanURL = async (url: string) => {
    if (!isValidURL(url)) {
      setError(new Error("Invalid URL."));
      return
    }

    // Check cache first
    const cachedResult = cacheService.getCachedResult(url)
    if (cachedResult) {
      setData(cachedResult)
      setUrl("")
      return
    }

    setLoading(true)
    setData(null) // Clear previous data
    setError(null) // Clear previous error

    try {
      const { data: responseData, error: responseError } = await analyseArticleUrl(url)

      if (responseData) {
        setData(responseData)
        // Cache the result
        cacheService.setCachedResult(url, responseData)
        setCacheSize(cacheService.getCacheSize())
        // clear the input
        setUrl("")
        console.log('URL scan result:', responseData)
      } else if (responseError) {
        setError(new Error(typeof responseError === 'string' ? responseError : 'An error occurred during analysis.'))
        console.error('Error during URL scan:', responseError)
      } else {
        setError(new Error("The analysis service returned an empty response."))
      }
    } catch (err) {
      console.error('Error during URL scan:', err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Error handling
  const errorMessage = getErrorMessage(error);

  // Cache management
  useEffect(() => {
    // Update cache size on mount
    setCacheSize(cacheService.getCacheSize())
  }, [])

  const clearCache = () => {
    cacheService.clearCache()
    setCacheSize(0)
  }

  return (
    <ThemeProvider theme={matrixTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              animation: 'titleGlow 2s infinite alternate',
              '@keyframes titleGlow': {
                from: {
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                },
                to: {
                  textShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
                },
              },
            }}
          >
            NewsGuard AI Analyser
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            sx={{ width: '100%', maxWidth: '600px', mb: 3 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Enter article URL to scan..."
              value={url}
              onChange={(e) => handleUrlChange(e)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 255, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(0, 255, 0, 0.7)',
                  },
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => scanURL(url)}
              disabled={loading || !url}
              sx={{
                minWidth: '100px',
                height: '56px',
                animation: loading ? 'none' : 'buttonGlow 2s infinite alternate',
                '@keyframes buttonGlow': {
                  from: {
                    boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                  },
                  to: {
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.8)',
                  },
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Scan'}
            </Button>
          </Stack>

          {loading && <LoadingIndicator />}

          {errorMessage && !loading && error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                mb: 2,
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                '& .MuiAlert-icon': {
                  color: 'error.main',
                },
              }}
            >
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}

          {data && !loading && !errorMessage && <AnalysisResultCard data={data} />}

          {cacheSize > 0 && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Cached results: {cacheSize}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={clearCache}
                sx={{
                  borderColor: 'rgba(0, 255, 0, 0.3)',
                  color: 'rgba(0, 255, 0, 0.7)',
                  '&:hover': {
                    borderColor: 'rgba(0, 255, 0, 0.7)',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  },
                }}
              >
                Clear Cache
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App

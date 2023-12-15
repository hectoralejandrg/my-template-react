import { Typography, styled } from '@mui/material'
import { useEffect, useState } from 'react'
// import { useEffect, useState } from 'react'

const ContainerCarousel = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // animation: 'slide 3s infinite',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    marginTop: '15%'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    marginTop: '35%'
  }
}))

const Slide = styled('img')(({ theme }) => ({
  marginBottom: '5%',
  // height: 'auto',
  // width: '20%',
  transition: 'transform 0.5s ease-in-out'
}))

interface SliderProps {
  images: Array<{ src: string; alt: string }>
}

const SliderWithIcons = ({ images }: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [images.length])

  return (
    <ContainerCarousel>
      <Slide
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        // style={{ transform: `translateX(-${100}%)` }}
      />
      <Typography component={'span'} color={'white'}>
        {images[currentIndex].alt}
      </Typography>
    </ContainerCarousel>
  )
}

export default SliderWithIcons

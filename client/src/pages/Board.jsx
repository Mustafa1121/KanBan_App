import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/BoardApi'
import EmojiPicker from '../components/common/EmojiPicker'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import { setBoard, setBoards } from '../redux/features/boardSlice'
import {setFavoriteList} from '../redux/features/FavoriteSlice'
import KanBan from '../components/common/KanBan'

const timeout=500
let timer
function Board() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [icon, setIcon] = useState('')
  const favoriteList = useSelector((state) => state.favorites.value)

  const boards = useSelector((state) => state.board.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavorite(res.favorite)
        setIcon(res.icon)
      } catch (error) {
        console.log(error)
      }
    }

    getBoard()
  }, [boardId,sections])


  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }
    if(isFavorite){
      let tempFavorite = [...favoriteList]
      const Favindex = tempFavorite.findIndex(e => e.id === boardId)
      tempFavorite[Favindex] = {...tempFavorite[Favindex],icon:newIcon}
      dispatch(setFavoriteList(tempFavorite))
    }

    dispatch(setBoards(temp))
    setIcon(newIcon)
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      alert(err)
    }
  }

  const changeTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = {...temp[index],title:newTitle}
    dispatch(setBoards(temp))

    if(isFavorite){
      let tempFavorite = [...favoriteList]
      const Favindex = tempFavorite.findIndex(e => e.id === boardId)
      tempFavorite[Favindex] = {...tempFavorite[Favindex],title:newTitle}
      dispatch(setFavoriteList(tempFavorite))
    }

    

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);

  }

  const changeDescription = async (e) => {
    clearTimeout(timer)
    const newDesc = e.target.value
    setDescription(newDesc)

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDesc })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const addFavorite = async () => {
    try {
      const board = await boardApi.update(boardId,{favorite:!isFavorite})
      let newFavoriteList = [...favoriteList]
      if(isFavorite){
        newFavoriteList = newFavoriteList.filter(e => e.id !== boardId)
      }else{
        newFavoriteList.unshift(board)
      }
      dispatch(setFavoriteList(newFavoriteList))
      setIsFavorite(!isFavorite)
    } catch (error) {
      alert(error)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)
      if(isFavorite){
        const newFavoriteList = favoriteList.filter(e => e.id !== boardId)
        dispatch(setFavoriteList(newFavoriteList))
      }
      const newList = boards.filter(e => e.id!== boardId)
      if(newList.length === 0){
        navigate('/boards')
      }
      else{
        navigate(`/boards/${newList[0].id}`)
      }

      dispatch(setBoards(newList))
    } catch (error) {
      alert(error)
    }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <IconButton variant='outlined' onClick={addFavorite}>
          {
            isFavorite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            onChange={changeTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={changeDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
           {/* Kan Ban */}
          <KanBan data={sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  )
}

export default Board
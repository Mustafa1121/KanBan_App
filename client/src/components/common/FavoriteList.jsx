import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react'
import { Box } from '@mui/system'
import { Link , useNavigate } from 'react-router-dom'
import { Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import boardApi from '../../api/BoardApi'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { setFavoriteList } from '../../redux/features/FavoriteSlice'


const FavoriteList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const list = useSelector((state) => state.favorites.value)
    const [activeIndex, setactiveIndex] = useState(0)
    const { boardId } = useParams()


    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await boardApi.getFavorite()
                dispatch(setFavoriteList(res))
            } catch (error) {
                alert(error)
            }
        }

        getBoards()
    }, [])

    useEffect(() => {
        const index = list.findIndex(e => e.id === boardId)
        setactiveIndex(index)
    },[list,boardId])

    const onDragEnd = async ({source,destination}) => {
        const newList = [...list]
        const [removed] = newList.splice(source.index,1)
        newList.splice(destination.index,0,removed)
    
        const activeItem = newList.findIndex(e => e.id === boardId)
        setactiveIndex(activeItem)
        dispatch(setFavoriteList(newList))
    
        try {
          await boardApi.updateFavoritePoistion({boards:newList})
        } catch (error) {
          alert(error)
        }
      }


    return (
        <>
            <ListItem>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                >
                    <Typography variant='body2' fontWeight='700'>
                        Favorites
                    </Typography>
                </Box>
            </ListItem>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
                    {
                        (provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    list.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {
                                                (provided, snapshot) => (
                                                    <ListItemButton
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        selected={index === activeIndex}
                                                        component={Link}
                                                        to={`/boards/${item.id}`}
                                                        sx={{
                                                            pl: '20px',
                                                            cursor: snapshot.isDragging ? 'grap' : 'pointer!important'
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='body2'
                                                            fontWeight='700'
                                                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        >
                                                            {item.icon} {item.title}
                                                        </Typography>
                                                    </ListItemButton>
                                                )
                                            }
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
        </>
    )
}

export default FavoriteList
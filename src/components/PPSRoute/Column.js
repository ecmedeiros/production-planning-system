import { Flex, Text } from "@chakra-ui/react"
import React, { useState } from 'react'
import { Droppable, Draggable } from "react-beautiful-dnd"
import { format } from 'date-fns';
import RecalcButton from './RecalcButton';
import HeaderColumn from './HeaderColumns';

function sumTimes(date_one, minutesToSum) {
    try {
        const milissegundosParaAdicionar = minutesToSum * 60 * 1000;
        const dataFinal = new Date(date_one.getTime() + milissegundosParaAdicionar);
        return dataFinal

    } catch (err) {
        console.log(err)
        alert('Ocorreu um erro ao calcular a soma dos horários. Por favor, entre em contato com o administrador do sistema para obter assistência.');
        console.log('Dados que cairam em erro:', date_one, minutesToSum)
    }
}

const Column = ({ column, orders }) => {
    const [addedTexts, setAddedTexts] = useState(orders.map((order) => order.horario_fim));
    const headers_col2 = [
        { name: 'Modelo', width: '14%' },
        { name: 'Talão', width: '16.5%' },
        { name: 'Cliente', width: '18%', height: '3em' },
        { name: 'Quant', width: '13%' },
        { name: 'Inicio', width: '23%' },
        { name: 'Fim', width: '23%' },
    ]
    const headers_col1 = [
        { name: 'Modelo', width: '22%' },
        { name: 'Talão', width: '24%' },
        { name: 'Cliente', width: '18%', height: '3em' },
        { name: 'Quant', width: '28%' },

    ]

    const handleTextAddition = (index) => {

        setAddedTexts(prevAddedTexts => {
            const currentTime = new Date()
            const orderMinutes = orders[index].minutos
            const milisecondsFinalDate = sumTimes(currentTime, orderMinutes)
            const finalDate = new Date(milisecondsFinalDate)

            if (typeof orders[index - 1] != 'undefined') {
                orders[index].horario_inicio = currentTime
                orders[index].horario_fim = finalDate

                const next_index = index + 1
                for (let i = next_index; i < orders.length; i++) {
                    const currentOrderMinutes = orders[i].minutos
                    const finalDateAnterior = new Date(orders[i - 1].horario_fim)
                    const currentSummedDate = sumTimes(finalDateAnterior, currentOrderMinutes)
                    const currentFinalDate = new Date(currentSummedDate)

                    orders[i].horario_inicio = orders[i - 1].horario_fim
                    orders[i].horario_fim = currentFinalDate
                }

            } else {
                orders[index].horario_inicio = currentTime
                orders[index].horario_fim = finalDate

                for (let i = 1; i < orders.length; i++) {
                    const currentOrderMinutes = orders[i].minutos
                    const finalDateAnterior = new Date(orders[i - 1].horario_fim)
                    const currentSummedDate = sumTimes(finalDateAnterior, currentOrderMinutes)
                    const currentFinalDate = new Date(currentSummedDate)

                    orders[i].horario_inicio = orders[i - 1].horario_fim
                    orders[i].horario_fim = currentFinalDate
                }
            }

            const newAddedTexts = orders.map(order => order.horario_fim);
            return newAddedTexts
        });
    }
    return (

        <Flex
            rounded="3px"
            bg="column-bg"
            w="48%"
            h="79vh"
            flexDir="column"
            mr="1.5rem"
        >
            <Flex
                align="center"
                h="7.5vh"
                bg="column-header-bg"
                rounded="3px 3px 0 0"
                px="1.5rem"
                mb="1.5rem"
            >
                <Text readOnly fontSize="4.6vh" fontWeight={600} color="subtle-text">
                    {column.title}
                </Text>
                {/* {console.log(column, 'TESTE')} */}
            </Flex>

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <Flex
                        px="1.5rem"
                        flex={1}
                        flexDir='column'
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        overflow='hidden'
                        overflowY="auto"
                        marginRight='.5rem'
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '2.4vh',
                                borderRadius: '1vh',
                                backgroundColor: `main-bg`,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: `card-bg`,
                                borderRadius: '1vh',
                            },
                        }}
                    >

                        {column.id === 'column-1' && <HeaderColumn column={headers_col1}></HeaderColumn>}
                        {column.id === 'column-2' && <HeaderColumn column={headers_col2}></HeaderColumn>}

                        {orders.map((order, index) => (
                            <Draggable key={order.id} draggableId={`${order.id}`} index={index}>
                                {(draggableProvided, draggableSnapshot) => (
                                    <Flex
                                        mb="1rem"
                                        h="10vh"
                                        bg="card-bg"
                                        rounded="3px"
                                        p='1rem'
                                        outline="2px solid"
                                        outlineColor={draggableSnapshot.isDragging ? "card-border" : "transparent"}
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                        boxShadow={draggableSnapshot.isDragging ? "0 5px 10px rgba(0,0,0,0.6)" : "unset"}
                                        alignItems={"center"}
                                        justifyContent="space-between"
                                    >

                                        <Text width="14%" textAlign={'center'} fontSize='2.5vh'>{order.modelo}</Text>

                                        <Text width="16.5%" borderLeft="1px solid" textAlign={'center'} fontSize='2.5vh'>{order.talao}</Text>

                                        <Text width="18%" overflow='hidden' borderLeft="1px solid" borderRight="1px solid" height='3rem' textAlign={'center'} fontSize='2.3vh'>{order.cliente}</Text>

                                        {column.id === 'column-2' ?
                                            <Text width="13%" textAlign={'center'} fontSize='2.5vh'>{Number(order.quantidade_pares).toFixed()}</Text>
                                            :
                                            <Text mr='15%' width="13%" textAlign={'center'} fontSize='2.5vh'>{Number(order.quantidade_pares).toFixed()}</Text>
                                        }

                                        {column.id === 'column-2' && (
                                            <Text width="23%" borderLeft="1px solid" textAlign={'center'} fontSize='2.5vh' >{order.horario_inicio !== null ? format((new Date(order.horario_inicio)), 'dd/MM HH:mm') : addedTexts[index] = '00/00'}</Text>
                                        )}

                                        {column.id === 'column-2' && (
                                            <Text width="23%" borderLeft="1px solid" textAlign={'center'} fontSize='2.5vh'>{order.horario_fim != null ? format((new Date(order.horario_fim)), 'dd/MM HH:mm') : addedTexts[index] = '00/00'}</Text>
                                        )}




                                        {draggableProvided.placeholder}
                                        {column.id === 'column-2' && <RecalcButton
                                            orders={orders}
                                            onButtonClick={(text) => handleTextAddition(text, index)}
                                            index={index}
                                        />}

                                    </Flex>
                                )}
                            </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                    </Flex>
                )}
            </Droppable>
        </Flex>
    )
}


export default Column
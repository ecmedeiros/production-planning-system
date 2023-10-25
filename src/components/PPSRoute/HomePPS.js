// import {  } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { DragDropContext } from "react-beautiful-dnd"
import SaveButton from './SaveButton'
import PreviousPageButton from './PreviousPageButton'
import { useRouter } from 'next/router'


const Column = dynamic(() => import('./Column'), { ssr: false })
const defaultDate = '1970-01-01T03:00:00.000Z'


const reorderColumnList = (sourceCol, startIndex, endIndex) => {
    const newOrderIds = Array.from(sourceCol.orderIds);
    const [removed] = newOrderIds.splice(startIndex, 1);
    // console.log([removed], '<==')
    newOrderIds.splice(endIndex, 0, removed);

    const newColumn = {
        ...sourceCol,
        orderIds: newOrderIds,
    };

    return newColumn;
};

export default function Home({machineId}) {
    const [state, setState] = useState(null);
    const router = useRouter()

    useEffect(() => {
        function fetchData() {
            saveOrders(machineId).then(data => setState(old => ({ ...old, ...data })));
        }


        fetchData();
    }, [machineId]);


    const OnDragEnd = async (result) => {
        const { destination, source } = result

        //if user tries to drop in an unknown destination
        if (!destination) return

        //if the user drags and drops in the same position
        if (destination.droppableId === source.droppedId &&
            destination.index === source.index) { return };

        //if the users drops within the same column but in a different position
        const sourceCol = state.columns[source.droppableId]
        const destinationCol = state.columns[destination.droppableId]

        if (sourceCol.id === destinationCol.id) {
            const newColumn = reorderColumnList(
                sourceCol,
                source.index,
                destination.index
            )

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn
                },
            }
            setState(newState)
            return;
        }
        //if the user moves from one column to another
        const startOrderId = Array.from(sourceCol.orderIds)
        const [removed] = startOrderId.splice(source.index, 1)
        const newStartCol = {
            ...sourceCol,
            orderIds: startOrderId
        }

        const endOrderId = Array.from(destinationCol.orderIds)
        endOrderId.splice(destination.index, 0, removed)
        const newEndCol = {
            ...destinationCol,
            orderIds: endOrderId
        }

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol
            }
        };

        setState(newState)

    }

    if (!state) {
        return (<Flex justifyContent="center"><h1>Loading...</h1><Spinner /></Flex>)
    }


    return (
        <DragDropContext onDragEnd={OnDragEnd}>
            <title>YOUR PPS</title>

            <Flex
                flexDir='column'
                bg="main-bg"
                minH='100vh'
                w='full'
                color='white-text'
                pb="2rem"
            >

                <PreviousPageButton column={state.columns} orders={state.orders} machineId={machineId}/>

                <Flex justify="center" px="5vh" mt="1.5rem">
                    {state.columnRange.map(columnId => {
                        const column = state.columns[columnId]
                        const orders = column.orderIds.map(orderId => state.orders[orderId]);

                        return <Column key={column.id} column={column} orders={orders} />
                    })}
                    <Flex left="91%" position="absolute" justifyContent="end" mt=".5rem" mr="2rem">
                        <SaveButton column={state.columns} orders={state.orders} machineId={machineId}/>
                    </Flex>
                </Flex>

            </Flex>
        </DragDropContext>
    )
}

async function getData() {
    const response = await fetch('/api/getOrders');
    const data = await response.json();
    return data;
}

async function saveOrders(machineId) {
    const result = await getData();

    const ordersData = result.reduce((acc, order) => {

        acc.orders = {
            ...acc.orders,
            [order.id]: order
        };

        if (order.horario_fim === null || order.horario_fim === defaultDate) {
            acc.columns["column-1"].orderIds.push(order.id);
        }
        else if(order.id_maquina == machineId){
            acc.columns["column-2"].orderIds.push(order.id);
        }else{
            console.log(machineId,order.id_maquina)
        }

        acc.columns["column-1"].orderIds.sort()
        return acc;
    }, {
        orders: {},
        columns: {
            "column-1": {
                id: "column-1",
                title: "OP's DISPONÍVEIS",
                orderIds: []
            },
            "column-2": {
                id: "column-2",
                title: "OP's EM PRODUÇÃO",
                orderIds: []
            },
            "column-3": {
                id: "column-3",
                title: "COMPLETED",
                orderIds: []
            },
        },
        columnRange: ["column-1", "column-2"]
    });
    return ordersData;
}


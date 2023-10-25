import React, { useState } from 'react';
import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from 'next/router'
import { format } from 'date-fns';
import PreviousPageButton from './PreviousPageButton'


function transformaString(input) {
    return input.replace(/(\D+)(\d+)/, (_, parte1, parte2) => `${parte1.toUpperCase()} ${parte2}`);
}

async function fetchConclusionTime(machineId) {
    const response = await fetch('/api/getConclusionTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ machineId }),

    })



    const data = await response.json();
    // console.log('Received conclusion time data:', data);
    return data;
}

const ColumnCells = ({ groups, machines }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [machinesForGroup, setMachinesForGroup] = useState(null)
    const router = useRouter();

    const handleMachineClick = (machine) => {
        router.push(`/producao/${machine.id}`)
    }

    const handleGroupClick = async (group) => {
        const machinesForSelectedGroup = machines.filter(machine => machine.id_grupo === group.id)
        for (let machine in machinesForSelectedGroup) {
            try {
                const conclusionTime = await fetchConclusionTime(machinesForSelectedGroup[machine].id);
                machinesForSelectedGroup[machine].horario_inicio = conclusionTime.horario_inicio;
                machinesForSelectedGroup[machine].horario_fim = conclusionTime.horario_fim;

                // console.log('Conclusion time for machine:', conclusionTime, 'for machineId:', machinesForSelectedGroup[machine]);
            } catch (error) {
                console.error('Error fetching conclusion time for machineId:', machinesForSelectedGroup[machine].id, error);
            }
        }

        setMachinesForGroup(machinesForSelectedGroup)
        setSelectedGroup(group)
        // console.log('Machines for selected group:', machinesForSelectedGroup);

    }

    return (
        <Flex
            rounded="3px"
            bg="column-bg"
            w="auto"
            h="79vh"
            flexDir="column"
            mr="1.5rem"
        >
            {selectedGroup !== null && <PreviousPageButton></PreviousPageButton>}
            {/* Fazer selectedGroup virar null quando clicar em previous page */}

            <Flex
                align="center"
                h="7.5vh"
                bg="column-header-bg"
                rounded="3px 3px 0 0"
                px="1.5rem"
                mb="1.5rem"
                justifyContent="space-between"
            >
                <Text readOnly fontSize="4.6vh" fontWeight={600} color="subtle-text">SELECIONE A CELULA</Text>
            </Flex>

            <Flex
                px="1.5rem"
                flex={1}
                flexDir='column'
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
                {selectedGroup === null ? groups.map((group, index) => (
                    <Flex
                        key={index}  // Adicionando uma chave única para cada elemento
                        mb="1rem"
                        h="10vh"
                        bg="card-bg"
                        rounded="3px"
                        p='1rem'
                        alignItems="center"
                        justifyContent="center"
                        fontSize="7vh"
                        cursor="pointer"
                        _hover={{ backgroundColor: 'hover-color' }}

                        onClick={() => { handleGroupClick(group) }}
                    >
                        <Text>{transformaString(group.desc_grupo)}</Text>
                    </Flex>
                )) :

                    machinesForGroup.map((machine, index) => (
                        <Flex
                            key={index}  // Adicionando uma chave única para cada elemento
                            mb="1rem"
                            h="10vh"
                            bg="card-bg"
                            rounded="3px"
                            p='1rem'
                            alignItems="center"
                            // justifyContent='space-between'
                            fontSize="280%"
                            cursor="pointer"
                            _hover={{ backgroundColor: 'hover-color' }}
                            onClick={() => { handleMachineClick(machine) }}
                        >
                            <Text width={'16rem'} mr='4rem'>{transformaString(machine.desc_maquina)}</Text>
                            <Text width={'8rem'} mr='4rem' >{machinesForGroup[index].horario_inicio !== null
                                ? format(new Date(machinesForGroup[index].horario_inicio), 'dd/MM')
                                : ''}
                            </Text>

                            {console.log(machinesForGroup[index].horario_fim !== null, '<<<<')}

                            <Text width={'8rem'}>
                                {machinesForGroup[index].horario_fim !== null
                                    ? format(new Date(machinesForGroup[index].horario_fim), 'dd/MM')
                                    : ''}
                            </Text>

                        </Flex>
                    ))
                }

            </Flex>
        </Flex>
    );
}

export default ColumnCells;

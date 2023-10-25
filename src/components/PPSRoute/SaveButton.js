import { motion } from 'framer-motion';
import { Flex } from "@chakra-ui/react";
import React, { useState } from 'react';
const defaultDate = '1970-01-01T03:00:00.000Z';

import { Image } from '@chakra-ui/react';

const SaveButton = ({ column, orders, machineId }) => {
    const [isClicked, setIsClicked] = useState(false);

    async function saveData(orders, machineId) {
        const response = await fetch('/api/saveEndTime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orders, machineId }),
        });
        const data = await response.json();
        return data;
    }

    const handleButtonClick = () => {
        setIsClicked(true);

        setTimeout(async () => {
            // Ensure isClicked is always set to false when the click action is complete
            setIsClicked(false);
            // TODO: Função que salva as ops
            const column_one_ids = column['column-1'].orderIds;
            const column_two_ids = column['column-2'].orderIds;
            const columns_changed = [];

            async function processProdOrders() {
                for (const orderId of column_two_ids) {
                    if (orders[orderId].horario_fim === defaultDate) {
                        alert('Existem ordens que ainda não foram recalculadas!');
                        return;
                    } else {
                        console.log(orders[orderId].horario_fim);
                        orders[orderId].id_maquina = machineId
                        columns_changed.push(orders[orderId]);
                    }
                }
                await processAvaiOrders();
                // await saveData(columns_changed)
                console.log(columns_changed);
            }

            // Call the function to process orders synchronously
            await processProdOrders();

            async function processAvaiOrders() {
                for (const orderIdColumn1 of column_one_ids) {
                    if (orderIdColumn1 !== defaultDate) {
                        orders[orderIdColumn1].horario_fim = defaultDate;
                        orders[orderIdColumn1].horario_inicio = defaultDate;
                        orders[orderIdColumn1].column_index = null;
                        orders[orderIdColumn1].id_maquina = null;
                        columns_changed.push(orders[orderIdColumn1]);
                    }
                }
                await saveData(columns_changed, machineId);
                alert('Ordens salvas com sucesso!')

            }
        }, 100);
    };


    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isClicked ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
        >
            <Flex
                rounded="3px"
                bg="card-bg"
                w="5vh"
                h="5vh"
                fontSize='2vh'
                mr="1.5rem"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                backgroundColor='main-bg'
                _hover={{ backgroundColor: 'column-bg' }}
                onClick={handleButtonClick}
            >
                <motion.div
                    whileHover={{ scaleX: isClicked ? -0.10 : 1 }}
                >
                    <Image
                        src="../images/save.png"
                        alt="Menu"
                        width={'20px'}
                    />
                </motion.div>
            </Flex>
        </motion.div>
    );
}

export default SaveButton;

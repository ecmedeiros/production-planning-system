import { motion } from 'framer-motion';
import { Flex } from "@chakra-ui/react";
import { Image } from '@chakra-ui/react';
import React, { useState } from 'react';

const ConfigButton = ({ onButtonClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(true);

        setTimeout(() => {
            setIsClicked(false);
            // onButtonClick(index)
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
                bg="column-bg"
                w="auto"
                p=".5rem"
                h="5vh"
                fontSize='2vh'
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{ backgroundColor: 'hover-color' }}
                onClick={handleButtonClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    whileHover={{ rotate: isHovered ? 180 : 0 }}
                >
                    <Image
                        src="../images/menu.png"
                        alt="Menu"
                        width={'24px'}
                    />
                </motion.div>
            </Flex>
        </motion.div>
    );
}

export default ConfigButton;

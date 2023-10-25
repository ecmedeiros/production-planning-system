import { motion } from 'framer-motion';
import { Flex } from "@chakra-ui/react";
import React, { useState } from 'react';
import { Image } from '@chakra-ui/react';


const RecalcButton = ({ onButtonClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(true);
        setIsHovered(true)


        setTimeout(() => {
            setIsClicked(false);
            setIsHovered(false)

            onButtonClick(index)

        }, 100);
    };

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isClicked ? 1.2 : 1 }} // Animação de escala
            transition={{ duration: 0.2 }} // Duração da animação
        >
            <Flex
                // ml="1.8rem"
                rounded="3px"
                bg="column-bg"
                w="auto"
                h="4.5vh"
                fontSize='2vh'
                p=".5rem"
                alignItems="center"
                cursor="pointer"
                _hover={{ backgroundColor: 'hover-color' }}
                onClick={handleButtonClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                
            >
                <motion.div
                    whileHover={{ rotate: isHovered ? 190 : -180 }}
                >
                    <Image
                        src="../images/refresh.png"
                        alt="Menu"
                        width={'24px'}
                    />
                    
                </motion.div>
            </Flex>
        </motion.div>

    );
}

export default RecalcButton;

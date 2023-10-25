import { motion } from 'framer-motion';
import { Flex } from "@chakra-ui/react";
import { Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router'


const imageVariants = {
    initial: { x: 0 },
    hover: { x: -10 },
};

const PreviousPageButton = ({ onButtonClick, index }) => {
    const [isClicked, setIsClicked] = useState(false);
    const router = useRouter();

    const handleButtonClick = () => {
        setIsClicked(true);
        const currentRoute = router.asPath


        setTimeout(() => {
            console.log(currentRoute === '/')
            currentRoute === `/` ? router.reload() : router.push(`/`)
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
            >
                <motion.div
                    variants={imageVariants}
                    initial="initial"
                    whileHover="hover"
                >
                    <Image
                        src="../images/back.png"
                        alt="Menu"
                        width={'24px'}
                    />
                </motion.div>
            </Flex>
        </motion.div>
    );
}

export default PreviousPageButton;
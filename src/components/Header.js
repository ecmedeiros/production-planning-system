import { Flex } from '@chakra-ui/react'
import Link from 'next/link';

export default function Header() {
    return (
        <Flex bg="fiber-color" color="white" h="12.2vh" align="center" px="4.5vh" fontSize="5vh" fontWeight={600}>
            <Link href="/">YOUR PPS</Link>
        </Flex>
    )

}
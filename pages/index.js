import { Flex, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Header from '../src/components/Header'

const ColumnCells = dynamic(() => import('../src/components/PPSRoute/ColumnCells'), { ssr: false });

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getCells');
                const jsonData = await response.json();

                setData(jsonData);
                setLoading(false); // Set loading to false once data is fetched
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <title>YOUR PPS</title>

            <Flex
                flexDir='column'
                bg="main-bg"
                minH='100vh'
                w='full'
                color='white-text'
                pb="2rem"
            >
                <Header/>

                <Flex justify="center" px="5vh" mt="1.5rem">
                    {loading ? <Spinner /> : <ColumnCells groups={data[0].groups} machines={data[0].machines} />}
                </Flex>
            </Flex>
        </>
    );
}

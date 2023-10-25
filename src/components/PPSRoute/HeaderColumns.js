import { Center, Flex, Text } from '@chakra-ui/react';
import ConfigButton from './ConfigButton'; // Importando o componente RecalcButton


const HeaderColumn = (headers) => {
    return (
        <Flex
            mb=".5rem"
            h="7vh"
            bg="card-bg"
            rounded="3px"
            p="1rem"
            alignItems={'center'}
        >
            {/* {console.log(headers.column.name)} */}
            {headers.column.map((text, index) => (
                console.log(index, (headers.column.length -1)),
                (index > 0 ?
                    (index === (headers.column.length -1)
                        ?<Text _hover={{ cursor: 'pointer', backgroundColor: 'hover-color' }} borderLeft='1px' textAlign='center' width={text.width}>{text.name}</Text>
                        :<Text _hover={{ cursor: 'pointer', backgroundColor: 'hover-color' }} borderLeft='1px' textAlign='center' width={text.width}>{text.name}</Text>
                        )
                        :
                        <Text _hover={{ cursor: 'pointer', backgroundColor: 'hover-color' }} textAlign='center' width={text.width}>{text.name}</Text>)
                ))
                


            }
            <ConfigButton></ConfigButton>
        </Flex>
    );
};

export default HeaderColumn;

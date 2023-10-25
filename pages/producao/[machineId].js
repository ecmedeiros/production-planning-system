// pages/producao/[machineId].js

import { useRouter } from 'next/router';
import Home from '../../src/components/PPSRoute/HomePPS'
import Header from '../../src/components/Header';

const MachinePage = () => {
  const router = useRouter();
  const { machineId } = router.query;


  //TO DO: CONSULT THE DATABASE AND AUTOMATIZE THE machineId MAX (31)
  if (machineId <= 31 && machineId > 0) {
    return (
      <>
        <Header />
        <Home machineId={machineId} />
      </>
    )
  } else {
    return 'Maquina selecionada não existe no registro do Banco de dados!'
  }

}

export default MachinePage;

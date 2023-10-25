async function insertTable() {
  const { wes, eligo } = require('./db')
  const Talao_pedido = require('./models/talao_pedido')

  const defaultDate = '1970-01-01T03:00:00.000Z'
  await wes.sync()

  const result = await eligo.query(`
  SELECT concat(a.talao,'-',a.SEQUENCIA_TALAO) talao,
  SUM(a.quantidade_processo) AS minutos,
  TO_CHAR(INTERVAL '1 second' * SUM(a.quantidade_processo), 'HH24:MI:SS') AS hora_ajustada,
  a.cliente,
  a.pedido_venda,
  SUM(a.quantidade_pedida) AS quantidade_pares,
  a.modelo
FROM (
-- Subconsulta
SELECT 'PEDIDOS COM TALÃO' AS BASE,
    ip3.sequencia AS SEQUENCIA_PROCESSOS,
    ip3.id AS ID_ITEM_PROCESSO,
    ip2.id AS id_item_talao,
    ip.id AS ID_ITEM_PEDIDO_VENDA,
    p2.pedido AS PEDIDO_PRODUCAO,
    ip3.produto_id AS produto_ip3,
    ip.observacoes AS OBSERVACAO_PEDIDO_VENDA,
    ip3.descricao AS PROCESSO,
    tp.tipo_produto AS TIPO_OPERACAO,
    p.pedido AS PEDIDO_VENDA,
    p.data_requerida AS DATA_ENTREGA_OFICIAL,
    p.ordem_compra AS ORDEM_COMPRA_CLIENTE,
    p.data_previsao_faturamento AS DATA_PREVISAO_FATURAMENTO,
    p.situacao AS SITUACAO_PEDIDO_VENDA,
    p.data_emissao AS DATA_EMISSAO_PEDIDO,
    p2.pedido AS TALAO,
    ip2.sequencia AS SEQUENCIA_TALAO,
    ip2.quantidade AS QUANTIDADE_PEDIDA,
    ip.sequencia AS SEQUENCIA_ITEM_PEDIDO_VENDA,
    ip.quantidade_pendente AS QUANTIDADE_PENDENTE,
    ip3.quantidade AS QUANTIDADE_PROCESSO,
    p4.nome_completo AS CLIENTE,
    p4.apelido AS CLIENTE_APELIDO,
    p5.produto AS produto_cod,
    p5.descricao AS PRODUTO_VENDA,
    vp.cod_referencia AS MODELO,
    tp2.tipo_produto AS TIPO_PRODUTO_VENDA,
    tp3.tipo_pedido AS TIPO_PEDIDO_VENDA,
    0 AS BLOQUEIO_CLIENTE,
    (
      SELECT DISTINCT equip.descricao
      FROM produtos equip
      WHERE equip.id = ip2.equipamento_producao_id
    ) AS MAQUINA_PRODUCAO,
    (
      SELECT CASE
        WHEN processos = 'TECIMENTO' THEN SUM(fabricado)
        ELSE SUM(quantidade)
      END
      FROM v_producao_v4 vpv
      WHERE vpv.ordem_producao = p2.pedido
        AND vpv.processos = ip3.descricao
        AND vpv.situacao = 'Concluído'
      GROUP BY ordem_producao, processos
    ) AS PRODUCAO_REALIZADA_TECIMENTO,
    (
      SELECT SUM(quantidade)
      FROM v_producao_v4 vpv
      WHERE vpv.ordem_producao = p2.pedido
        AND vpv.situacao = 'Concluído'
        AND vpv.processos = ip3.descricao
    ) AS PRODUCAO_REALIZADA_SEPARACAO,
    (
      SELECT SUM(quantidade)
      FROM v_producao_v4 vpv
      WHERE vpv.ordem_producao = p2.pedido
        AND vpv.situacao = 'Concluído'
        AND vpv.processos = ip3.descricao
    ) AS PRODUCAO_REALIZADA_VAPORIZACAO,
    (
      SELECT SUM(quantidade)
      FROM v_producao_v4 vpv
      WHERE vpv.ordem_producao = p2.pedido
        AND vpv.situacao = 'Concluído'
        AND vpv.processos = ip3.descricao
    ) AS PRODUCAO_REALIZADA_REVISAO
FROM pedidos p
JOIN itens_pedidos ip ON p.id = ip.pedido_id
JOIN itens_pedidos ip2 ON ip2.item_consumo_id = ip.id
JOIN pedidos p2 ON p2.id = ip2.pedido_id
JOIN itens_pedidos ip3 ON ip3.item_consumo_id = ip2.id
JOIN pedidos p3 ON p3.id = ip3.pedido_id
JOIN pessoas p4 ON p.cliente_id = p4.id
JOIN produtos p5 ON p5.id = ip.produto_id
JOIN vb_produtos vp ON vp.id = p5.id
JOIN produtos p6 ON p6.id = ip3.produto_id
JOIN tipos_produtos tp ON tp.id = p6.tipo_produto_id
JOIN tipos_produtos tp2 ON tp2.id = p5.tipo_produto_id
JOIN tipos_pedidos tp3 ON tp3.id = p.tipo_pedido_id
WHERE tp2.tipo_produto = 'CABEDAL'
AND p.situacao IN ('P')
AND ip3.descricao IN ('TECIMENTO')
) AS a
GROUP BY a.talao, a.SEQUENCIA_TALAO, a.cliente, a.pedido_venda, a.modelo
order by a.talao
`);

  let total_tempo = 0
  result[0].forEach(async row => {
    total_tempo += Number(row.minutos)
    try {
      const newTalao = await Talao_pedido.create({
        talao: row.talao,
        minutos: row.minutos,
        hora_ajustada: row.hora_ajustada,
        cliente: row.cliente,
        pedido_venda: row.pedido_venda,
        quantidade_pares: row.quantidade_pares,
        modelo: (row.modelo === null ? 'Sem ref.' : row.modelo),
        // id_maquina: '', 
        horario_fim: defaultDate,
        horario_inicio: defaultDate
      })
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const existingTalao = await Talao_pedido.findOne({
          where: { talao: row.talao }
        })

        if (existingTalao) {
          await existingTalao.update({
            minutos: row.minutos,
            hora_ajustada: row.hora_ajustada,
            quantidade_pares: row.quantidade_pares,
            modelo: (row.modelo === null ? 'Sem ref.' : row.modelo),
          })
        } else {
          console.error('Record not Found')
        }
      } else {
        console.error(err)
      }
    }
  });
}

// insertTable()

module.exports = insertTable
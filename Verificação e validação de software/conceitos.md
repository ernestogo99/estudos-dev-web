## Processo de v & v

- Assegura que o software cumpra com suas especificações e atenda ás necessiadades dos usuários
- É um processo que engloba todo o ciclo de vida
- V & V deve ser aplicado em cada estágio no processo de desenvolvimento
- Tem dois objetivos principais: Descobrir os defeitos no sistema e assegurar se o sistema é ou não utilizavel em uma situação operacional

# Conceitos básicos

## Defeito

- Uma imperfeição ou deficiência em um produto de trabalho onde o este não atende ao seus requisitos ou especificações e precisa ser reparado ou substituido
- ex:Omissões e imperfeições encontrados em fases iniciais do ciclo de vida

## Falta(fault)

- É um defeito estático no sistema
- Pode existir dentro de um sistema sem ter efeito no seu comportamento, nesse caso, a falta é caracterizada como dormente
- ex:uma linha de código errada

## Erro

- É um estado interno incorreto de um sistema
- Quando a falta é ativada, isto é, a linha de código é executada, ela leva o sistema para um estado interno incorreto
- ex: um contador de programa errôneo

## Falha(failure)

- É um comportamento externo incorreto do sistema
- Quando a linha de código errada é executada, o sistema é levado a um estado incorreto(isto é ,erro), que se for observável pelo usuário(ou pelo oráculo) caracteriza uma falha
- Uma falha pode também ter outras causas, como a entrada de dados inválidos por usuário

## Defeito vs falta

- Um defeito é uma falta se ele é encontrado durante a execução do software
- Um defeito não é uma falta se ele é detectado por inspeção ou análise estática e removido antes de executar o software

## Falta vs falha

- Uma falha pode ser causada por uma falta
- A falta pode causar uma ou mais falhas

## Ciclo de vida do defeito

Inserido -> detectado -> removido

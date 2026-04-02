# Visão Assistiva Inteligente
        
TÍTULO: Sistema Vision — Plataforma de Visão Assistiva para Pessoas Cegas  
TIPO: Especificação de produto  

CRÍTICAS (OBRIGATÓRIAS)  
- NÃO inventar APIs, bibliotecas ou hardware inexistentes  
- NÃO usar dados fictícios  
- NÃO simplificar arquitetura  
- TODO deve ser implementável hoje (2024–2026)  
- Se algo não for possível, explicar claramente e sugerir alternativa real  
- Priorizar soluções offline sempre que possível  
- Resposta deve ser técnica, estruturada e pronta para desenvolvimento  

OBJETIVO  
- Desenvolver um sistema completo composto por:  
  1. Aplicativo mobile  
  2. Integração com óculos inteligente  
  3. IA assistente por voz  
  4. Sistema Vision com 2 modos: Vision Full (contínuo) e Vision Smart (por mudança)  

ARQUITETURA DO SISTEMA  
- ÓCULOS: captura de imagem e movimento, enviam dados para o app  
- APP (SMARTPHONE): processa IA, decide quando falar, gera áudio  
- Comunicação principal: conexão sem fio de curto alcance (ex.: BLE)  
- Comunicação de backup: conexão direta de dispositivo (ex.: Wi‑Fi Direct)  
- Fluxo de dados: câmera → smartphone → modelo de IA → motor de decisão → TTS → usuário  

SISTEMA VISION  
Ativação por voz:  
- “Vision total ligar”  
- “Vision inteligente ligar”  
- “Vision desligar”  
Alternativa: toque duplo no óculos  

Modo 1 — VISION FULL  
- Descrição contínua do ambiente  
- Atualização a cada 1 segundo  
- Evita repetição usando cache de contexto  

Modo 2 — VISION SMART  
- Fala somente quando:  
  * Movimento da cabeça acima de um limiar (ex.: >15°)  
  * Mudança significativa na cena  
  * Aparecimento de novo objeto relevante  

DETECÇÃO DE MUDANÇA (alto nível)  
- Utilizar sensores de movimento (IMU) para detectar rotação angular  
- Comparar frames de câmera para identificar alterações de cena  
- Detectar objetos relevantes e disparar voz quando qualquer critério acima for atendido  

IA UTILIZADA (alto nível)  
- Visão computacional para detecção de objetos  
- Reconhecimento de voz offline  
- Síntese de voz  
- Assistente de linguagem leve ou serviço externo (com fallback offline)  

FUNCIONALIDADES DO APP MOBILE  
- Botão ligar/desligar Vision  
- Alternar modo (Full / Smart)  
- Assistente por voz  
- Configurações de áudio  
- Histórico de interações  
- Atualização de firmware  

CAPACIDADES DO ASSISTENTE DE IA  
- Responder perguntas como:  
  * “O que é isso?”  
  * “O que tem na minha frente?”  
  * “Tem perigo aqui?”  

HARDWARE REQUERIDO (lista de componentes)  
- Câmera compacta  
- Sensor de movimento (IMU)  
- Processador embarcado  
- Microfone  
- Alto-falante ou transdutor de condução óssea  
- Bateria recarregável  

OTIMIZAÇÃO  
- Reduzir taxa de quadros (ex.: 1–2 fps)  
- Utilizar modelos quantizados  
- Processamento principal no smartphone  
- Minimizar chamadas de rede constantes  

EXPERIÊNCIA DE USO (exemplo)  
Usuário: “Vision inteligente ligar”  
Sistema: “Modo inteligente ativado”  
Usuário anda: → “Você está em uma calçada”  
Usuário vira a cabeça: → “Tem um carro à direita”  
Usuário pergunta: “O que é isso?”  
Sistema: “É uma porta de loja”  
Usuário: “Vision desligar”  
Sistema: “Modo desativado”  

PROBLEMAS + SOLUÇÕES  
- Falha de fala excessiva → debounce + prioridade de eventos  
- Erro de detecção → múltiplos frames + confiança mínima  
- Consumo de bateria → processamento no celular  

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```

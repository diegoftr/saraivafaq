# SaraivaFAQ
Aplicativo desenvolvido para demonstrar o funcionamento do chatbot da google dialogflow utilizando o framework react native. Além de utilizar o dialogflow o atendimento pode ser redirecionado para um chat humano.

# Amazon API Gateway
Caso o usuário digite algo que o dialogflow entenda que o usuário queira conversar com um humano, o sistema redireciona seu atedimento para um chat humano utilizando a Amazon API Gateway que é um serviço da AWS para criação, publicação, manutenção, monitoramento e proteção de APIs REST e WebSocket em qualquer escala. Os desenvolvedores de API podem criar APIs que acessem a AWS ou outros web services, bem como dados armazenados na Nuvem AWS. Como um desenvolvedor de API do API Gateway, você pode criar APIs para uso em seus próprios aplicativos cliente. Ou você pode disponibilizar suas APIs para desenvolvedores de aplicativos de terceiros.

![Arquitetura Websockets](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2018/12/18/websockets-arch.png)

A Amazon API Gateway permite a criação de aplicativos de comunicação bidirecional usando APIs WebSocket no Amazon API Gateway sem precisar provisionar e gerenciar nenhum servidor.

As APIs baseadas em HTTP usam um modelo de solicitação / resposta com um cliente enviando uma solicitação para um serviço e o serviço respondendo de forma síncrona ao cliente. As APIs baseadas no WebSocket são de natureza bidirecional. Isso significa que um cliente pode enviar mensagens para um serviço e os serviços podem enviar mensagens para seus clientes independentemente.

Esse comportamento bidirecional permite tipos mais ricos de interações cliente / serviço, porque os serviços podem enviar dados aos clientes sem que um cliente precise fazer uma solicitação explícita. As APIs do WebSocket são frequentemente usadas em aplicativos em tempo real, como aplicativos de bate-papo, plataformas de colaboração, jogos com vários jogadores e plataformas de negociação financeira.


O dialogflow foi alimentado com os dados do FAQ da saraiva https://www.saraiva.com.br/central-de-atendimento.



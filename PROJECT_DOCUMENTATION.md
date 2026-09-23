# AI Agents Lab
## Проучване и практическо приложение на AI агенти и sub-агенти

---

# 1. Цел на проекта

Целта на проекта е да бъдат проучени основните концепции, свързани с AI Agents и Sub-Agents, и да бъде разработен практически Proof of Concept, който демонстрира как подобен подход може да бъде използван в контекста на софтуерната разработка и вътрешни фирмени процеси.

Основният фокус не е разработването на production-ready система, а изграждането на достатъчно реалистичен прототип, който демонстрира:

- как AI Agent взема решения;
- как използва външни функции и application tools;
- как достъпва вътрешна информация;
- как комбинира информация от няколко източника;
- как делегира специализирани задачи към Sub-Agent;
- как поддържа контекст между последователни съобщения;
- как се ограничават потенциално опасни действия;
- как човек може да одобрява или отказва операции;
- как Agent workflow-ът може да бъде наблюдаван и анализиран.

---

# 2. Основна идея

Разработеното приложение представлява вътрешен Developer Assistant.

Системата разполага с примерни:

- development tickets;
- API документация;
- Coordinator Agent;
- Frontend Specialist Agent;
- application tools;
- guardrails;
- conversation sessions;
- human approval workflow.

Потребителят комуникира с Agent-а чрез естествен език.

Вместо потребителят ръчно да избира конкретна функция или API, Agent-ът сам определя каква информация или capability му е необходима, за да изпълни заявката.

Пример:

```text
What are the requirements of DEV-101?
```

Agent-ът разпознава, че въпросът изисква вътрешна информация за ticket и използва съответния tool.

По-сложна заявка:

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

може да доведе до следния workflow:

```text
User
 ↓
Coordinator Agent
 ↓
get_ticket
 ↓
DEV-101
 ↓
relatedApi = Locations
 ↓
get_api_documentation
 ↓
Locations API
 ↓
Frontend Specialist Agent
 ↓
Coordinator Agent
 ↓
Final response
```

По този начин Agent-ът не е просто chatbot, а изпълнява координационна роля между различни capabilities.

---

# 3. Реализирана архитектура

Приложението е разделено на:

```text
Angular Frontend

        ↓

Node.js / Express Backend

        ↓

Coordinator Agent

        ↓

Tools / Sub-Agent / Guardrails / Sessions
```

Обобщена архитектура:

```text
                        ┌──────────────────────┐
                        │        User          │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   Angular Frontend   │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   Express Backend    │
                        └──────────┬───────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │   Coordinator Agent    │
                       └───────────┬────────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼

          get_ticket       get_api_documentation   Frontend
                                                Specialist Agent

                 │                 │
                 ▼                 ▼

          Ticket Data        API Documentation


                       Coordinator Agent
                              │
                              ▼
                    update_ticket_status
                              │
                              ▼
                         Guardrail
                              │
                              ▼
                      Human Approval
                              │
                              ▼
                        Tool Execution
```

---

# 4. Coordinator Agent

Coordinator Agent е основният Agent в системата.

Неговата роля е да:

- разбира потребителската заявка;
- определя дали е необходим tool;
- избира подходящия tool;
- използва резултата от tool-а;
- изпълнява последователни tool calls при необходимост;
- делегира специализирани задачи;
- използва conversation context;
- координира действия, изискващи approval;
- генерира крайния отговор.

Важен принцип в реализацията е Agent-ът да не измисля вътрешна информация.

Ако не разполага с достатъчно контекст, трябва да поиска уточнение.

Пример:

```text
Which API does it use?
```

Ако въпросът е част от разговор за конкретен ticket, Agent-ът може да използва conversation context.

Ако същият въпрос бъде зададен в нов разговор без контекст, Agent-ът трябва да поиска уточнение.

---

# 5. Function Tools

В проекта са реализирани три основни tools.

## 5.1 get_ticket

Tool за извличане на development ticket.

Пример:

```text
User:
What are the requirements of DEV-101?

        ↓

Coordinator Agent

        ↓

get_ticket

        ↓

DEV-101 data

        ↓

Final response
```

Това демонстрира как Agent може да използва информация, която не се намира директно в езиковия модел.

---

## 5.2 get_api_documentation

Tool за достъп до вътрешна API документация.

Пример:

```text
What endpoints are available in the Locations API?
```

Workflow:

```text
Coordinator Agent
        ↓
get_api_documentation
        ↓
Locations
        ↓
API definitions
        ↓
Final response
```

---

## 5.3 update_ticket_status

Tool за промяна на състоянието на ticket.

За разлика от първите два tools, този tool има side effect.

Затова около него са добавени допълнителни механизми:

```text
Agent request
 ↓
Input validation
 ↓
Guardrail
 ↓
Human Approval
 ↓
Execution
```

Това демонстрира важната разлика между:

```text
Read operation
```

и

```text
Action / Write operation
```

---

# 6. Sub-Agent

В системата е реализиран специализиран:

```text
Frontend Specialist Agent
```

Основната му задача е да анализира вече събрана информация и да създава практически frontend implementation plan.

Той е специализиран в:

- Angular;
- TypeScript;
- Components;
- Services;
- Models;
- API integration;
- State management;
- Validation;
- Loading states;
- Error handling;
- Pagination;
- Filters.

Coordinator Agent остава основният контролиращ Agent.

Workflow:

```text
Coordinator
 ↓
collect ticket data
 ↓
collect API documentation
 ↓
Frontend Specialist
 ↓
frontend analysis
 ↓
Coordinator
 ↓
final response
```

---

# 7. Agent-as-Tool подход

Frontend Specialist е реализиран чрез Agent-as-Tool подход.

Това означава, че Coordinator Agent може да го използва като специализиран capability.

```text
User
 ↓
Coordinator
 ↓
Frontend Specialist
 ↓
Coordinator
 ↓
User
```

Coordinator Agent запазва контрола върху разговора и крайния резултат.

Този модел е подходящ когато има един основен Agent, който трябва да координира различни специалисти.

---

# 8. Multi-Step Agent Workflow

Една от основните демонстрирани концепции е възможността една потребителска заявка да доведе до няколко последователни стъпки.

Пример:

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

За изпълнението Agent-ът може сам да установи, че трябва да:

```text
1. Зареди DEV-101

2. Анализира ticket-а

3. Установи свързаното API

4. Зареди API документацията

5. Предаде събраната информация
   на Frontend Specialist Agent

6. Получи специализиран анализ

7. Подготви финален отговор
```

Тази логика не е hardcoded като конкретен workflow за DEV-101.

Agent-ът използва наличните instructions, tools и context, за да избере подходящите стъпки.

---

# 9. Conversation Sessions

Реализирана е поддръжка на multi-turn разговори.

Пример:

```text
User:
Tell me about DEV-102.

Assistant:
...

User:
Which API does it use?
```

Вторият въпрос не съдържа директно `DEV-102`.

Agent-ът използва контекста от conversation session-а, за да разбере за кой ticket става въпрос.

Frontend-ът получава:

```text
conversationId
```

който се използва за следващите съобщения.

Концептуално:

```text
conversationId
 ↓
Session
 ↓
Conversation History
 ↓
Coordinator Agent
```

---

# 10. New Chat

Потребителят може да създаде нов conversation.

Това премахва стария context.

Пример:

```text
Conversation 1

Tell me about DEV-102.

Which API does it use?

→ Events
```

След:

```text
New Chat
```

и въпрос:

```text
Which API does it use?
```

Agent-ът вече не разполага с необходимия контекст и трябва да поиска уточнение.

Това демонстрира изолация между отделните разговори.

---

# 11. Guardrails

При действия, които променят данни, е реализирана допълнителна deterministic validation логика.

Ticket status workflow:

```text
OPEN
 ↓
IN_PROGRESS
 ↓
DONE
```

Разрешени:

```text
OPEN → IN_PROGRESS

IN_PROGRESS → DONE
```

Забранени:

```text
OPEN → DONE

DONE → OPEN

DONE → IN_PROGRESS
```

Пример:

```text
Change DEV-102 status to DONE.
```

ако ticket-ът е:

```text
OPEN
```

операцията трябва да бъде блокирана.

Важно е, че това правило не зависи само от решението на LLM.

То се проверява чрез application logic.

---

# 12. Human-in-the-Loop

Следващото ниво на контрол е Human Approval.

Дори когато операцията е валидна:

```text
OPEN → IN_PROGRESS
```

Agent-ът няма право автоматично да я изпълни.

Workflow:

```text
User request
 ↓
Agent requests tool
 ↓
Guardrail validation
 ↓
Operation is valid
 ↓
Agent run is paused
 ↓
Approval request
 ↓
User chooses
```

Потребителят има две възможности:

```text
Reject
```

или:

```text
Approve
```

При Reject:

```text
Tool is not executed
```

При Approve:

```text
Paused workflow resumes
 ↓
Tool executes
 ↓
Ticket is updated
```

Така човекът запазва крайния контрол върху действията със side effects.

---

# 13. Tracing и Observability

В проекта е включено tracing на Agent workflow-а.

Това позволява да се наблюдава не само крайният текстов отговор, а и вътрешният flow.

Например:

```text
Coordinator Agent
 ↓
get_ticket
 ↓
Coordinator Agent
 ↓
get_api_documentation
 ↓
Frontend Specialist
 ↓
Coordinator Agent
 ↓
Final response
```

Допълнително са оставени console logs при изпълнение на tools.

Пример:

```text
[TOOL] get_ticket called with ticketId=DEV-101

[TOOL] get_api_documentation called with resource=Locations

[TOOL] update_ticket_status executing: DEV-102 -> IN_PROGRESS
```

Това улеснява демонстрацията и debugging-а.

---

# 14. Потребителски интерфейс

Frontend приложението съдържа три основни секции.

## Development Tickets

Позволява визуален преглед на mock development tickets.

Показва:

- Ticket ID;
- Status;
- Description;
- Requirements;
- Related API.

---

## API Documentation

Позволява разглеждане на вътрешните mock API resources.

Показва:

- Resource;
- HTTP method;
- Endpoint;
- Description;
- Request example;
- Response example.

---

## AI Playground

Основният интерфейс за работа с Agent-а.

Поддържа:

- Conversation history;
- Session context;
- Agent responses;
- Human Approval;
- Approve / Reject;
- New Chat;
- Loading states;
- Error states.

---

# 15. Демонстрационен сценарий

За представяне на проекта е подходящ следният кратък demo flow.

## Demo 1 — Agent без tool

```text
Explain Angular dependency injection in two sentences.
```

Демонстрира:

```text
Normal LLM reasoning
```

без application tool.

---

## Demo 2 — Tool

```text
What are the requirements of DEV-101?
```

Демонстрира:

```text
Coordinator
 ↓
get_ticket
```

---

## Demo 3 — API Tool

```text
What endpoints are available in the Locations API?
```

Демонстрира:

```text
Coordinator
 ↓
get_api_documentation
```

---

## Demo 4 — Multi-Step + Sub-Agent

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

Демонстрира:

```text
Coordinator
 ↓
Ticket Tool
 ↓
API Tool
 ↓
Frontend Specialist
 ↓
Final response
```

Това е основният demo сценарий на проекта.

---

## Demo 5 — Conversation Context

```text
Tell me about DEV-102.
```

след това:

```text
Which API does it use?
```

Демонстрира:

```text
Conversation Session
```

След New Chat:

```text
Which API does it use?
```

Agent-ът трябва да поиска уточнение.

---

## Demo 6 — Guardrail

При DEV-102 със статус OPEN:

```text
Change DEV-102 status to DONE.
```

Очакване:

```text
Operation blocked
```

---

## Demo 7 — Human Approval

```text
Change DEV-102 status to IN_PROGRESS.
```

Появява се:

```text
Human Approval Required
```

След това могат да бъдат демонстрирани:

```text
Reject
```

и:

```text
Approve
```

---

# 16. Какво демонстрира проектът

Проектът демонстрира практически следните концепции:

```text
AI Agent

Agent Instructions

Function Tools

Multiple Tools

Tool Selection

Multi-Step Agent Workflow

Sub-Agent

Agent-as-Tool

Conversation Sessions

Conversation Context

Guardrails

Human-in-the-Loop

Read Operations

Write Operations

Tracing

Frontend Integration
```

---

# 17. Разлика спрямо стандартен chatbot

Стандартно LLM приложение:

```text
Prompt
 ↓
Language Model
 ↓
Response
```

Agent-based приложение:

```text
User request
 ↓
Agent
 ↓
Decision
 ↓
Tool Selection
 ↓
Internal Data
 ↓
Optional Sub-Agent
 ↓
Validation
 ↓
Optional Approval
 ↓
Action
 ↓
Final Response
```

Основната разлика е, че Agent-ът не само генерира текст.

Той може да координира различни application capabilities.

---

# 18. Потенциални приложения във фирмена среда

Подобен подход би могъл да бъде използван за автоматизация или подпомагане на различни вътрешни процеси.

Примерни направления:

### Software Development

Agent може да:

- анализира development ticket;
- намира свързана API документация;
- предлага implementation plan;
- генерира test scenarios;
- анализира errors;
- подпомага code review.

### Internal Documentation

Agent може да:

- търси информация в документация;
- комбинира информация от няколко документа;
- отговаря на въпроси за вътрешни системи;
- създава обобщения.

### Repetitive Tasks

Agent може да координира:

- статус промени;
- справки;
- recurring checks;
- генериране на стандартни документи;
- подготовка на отчети.

### Multi-System Workflows

При наличие на подходящи integrations един Agent би могъл да работи с:

```text
Jira
GitLab
GitHub
Internal APIs
Databases
Documentation systems
```

без потребителят ръчно да преминава през всяка система.

---

# 19. Основни ползи

## Natural Language Interface

Потребителят описва какво иска да постигне, вместо да избира конкретна техническа функция.

---

## Dynamic Tool Selection

Agent-ът може да избира различни tools според конкретната задача.

---

## Multi-Step Automation

Една заявка може да доведе до няколко последователни операции.

---

## Specialized Agents

Различни Sub-Agents могат да бъдат специализирани в конкретни области.

Пример:

```text
Frontend Specialist
Backend Specialist
QA Specialist
Documentation Specialist
```

---

## Human Control

Чувствителните действия могат да изискват human approval.

---

## Deterministic Safety Rules

Бизнес правилата могат да бъдат валидирани програмно, вместо да се разчита единствено на поведението на LLM.

---

# 20. Ограничения на PoC

Проектът е Proof of Concept и умишлено има ограничен scope.

Текущите ограничения включват:

- Mock ticket data;
- Mock API documentation;
- In-memory ticket changes;
- In-memory conversation sessions;
- In-memory approval state;
- Липса на authentication;
- Липса на persistent database;
- Липса на реална Jira/GitLab интеграция;
- Липса на production authorization model.

При рестарт на backend-а:

```text
Mock ticket statuses reset

Sessions are lost

Pending approvals are lost
```

Това е приемливо за целите на текущия PoC.

---

# 21. Какво би било необходимо за Production

При реално production приложение биха били необходими допълнителни механизми:

- Authentication;
- Authorization;
- Role-based access;
- Persistent database;
- Persistent sessions;
- Persistent approval state;
- Audit logging;
- Secret management;
- Rate limiting;
- Structured logging;
- Monitoring;
- Error tracking;
- Automated evaluations;
- Additional guardrails;
- Domain-level authorization;
- Secure external integrations.

Особено важно е критичните business permissions да не бъдат оставяни само на Agent instructions.

---

# 22. Възможности за бъдещо развитие

Следваща версия би могла да включва:

```text
Frontend Specialist
        +
Backend Specialist
        +
QA Specialist
        +
Documentation Specialist
```

както и integrations към:

```text
Jira
GitLab
GitHub
Internal company APIs
Documentation systems
```

Допълнителни възможности:

- automated test generation;
- issue analysis;
- repository analysis;
- persistent Agent memory;
- streaming responses;
- automated evaluations;
- MCP integrations;
- role-based permissions.

Тези функционалности не са необходими за изпълнение на настоящата Proof of Concept задача.

---

# 23. Резултат

В рамките на проекта беше създаден работещ Proof of Concept, който демонстрира:

```text
User
 ↓
AI Coordinator
 ↓
Reasoning
 ↓
Tool Selection
 ↓
Internal Data
 ↓
Sub-Agent
 ↓
Guardrails
 ↓
Human Approval
 ↓
Application Action
 ↓
Final Result
```

Проектът показва практически как AI Agents могат да бъдат използвани не само за генериране на текст, а за координиране на реални application capabilities.

---

# 24. Заключение

AI Agents представляват подход за изграждане на AI системи, при които language model-ът е част от по-голям application workflow.

Вместо моделът единствено да отговаря на въпроси, той може:

- да анализира задачата;
- да избира tools;
- да достъпва вътрешна информация;
- да комбинира няколко източника;
- да делегира работа;
- да поддържа conversation context;
- да предлага действия;
- да работи под deterministic ограничения;
- да изисква човешко одобрение;
- да участва в многостъпкови процеси.

Разработеният AI Agents Lab демонстрира тези концепции в ограничена и контролирана среда, ориентирана към software development use case.

Proof of Concept-ът предоставя добра основа за бъдеща оценка кои реални вътрешни фирмени процеси могат да се възползват от Agent-based архитектура.
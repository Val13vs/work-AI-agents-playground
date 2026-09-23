# AI Agents Lab — Demo Script

Този документ съдържа кратък сценарий за демонстрация на проекта.

Целта е в рамките на приблизително 5–10 минути да бъдат показани основните концепции:

- AI Agent
- Tools
- Multi-step workflow
- Sub-Agent
- Conversation Session
- Guardrails
- Human Approval
- Tracing

---

# 1. Начало на демонстрацията

## Какво да кажа

AI Agents Lab е Proof of Concept проект, чиято цел е да демонстрира как един AI Agent може да работи с вътрешни application capabilities, а не само да генерира текст.

В проекта имаме:

```text
Coordinator Agent

Tools

Frontend Specialist Sub-Agent

Conversation Sessions

Guardrails

Human Approval

Tracing
```

Основният use case е Developer Assistant, който работи с примерни development tickets и вътрешна API документация.

---

# 2. Покажи интерфейса

Отвори:

```text
http://localhost:4200
```

Покажи накратко трите основни секции:

```text
Tickets

API Documentation

AI Playground
```

## Какво да кажа

Tickets и API Documentation представляват mock вътрешни системи.

AI Agent-ът няма информацията hardcoded в prompt-а.

Когато има нужда от вътрешни данни, той трябва да използва съответния tool.

---

# 3. Demo 1 — Agent без Tool

Отвори:

```text
AI Playground
```

Стартирай New Chat.

Изпрати:

```text
Explain Angular dependency injection in two sentences.
```

## Какво трябва да се случи

Agent-ът трябва да отговори нормално.

В backend terminal-а не трябва да се вижда:

```text
[TOOL] get_ticket...
[TOOL] get_api_documentation...
[TOOL] update_ticket_status...
```

## Какво да кажа

Това показва, че Agent-ът не използва tool за всяка заявка.

Когато има достатъчно знания да отговори директно, той може да го направи без application call.

Concept:

```text
User
 ↓
Coordinator Agent
 ↓
Direct Response
```

---

# 4. Demo 2 — Tool Usage

Стартирай:

```text
New Chat
```

Изпрати:

```text
What are the requirements of DEV-101?
```

## Какво трябва да се случи

В backend terminal-а трябва да се появи:

```text
[TOOL] get_ticket called with ticketId=DEV-101
```

Agent-ът трябва да върне requirements от DEV-101.

## Какво да кажа

DEV-101 е вътрешна application информация.

Моделът не трябва да я измисля.

Затова Coordinator Agent избира:

```text
get_ticket
```

и използва резултата от tool-а.

Workflow:

```text
User
 ↓
Coordinator Agent
 ↓
get_ticket
 ↓
Ticket Data
 ↓
Final Response
```

---

# 5. Demo 3 — Втори Tool

Стартирай:

```text
New Chat
```

Изпрати:

```text
What endpoints are available in the Locations API?
```

## Какво трябва да се случи

В terminal:

```text
[TOOL] get_api_documentation called with resource=Locations
```

Agent-ът трябва да върне Locations endpoints.

## Какво да кажа

Тук Coordinator Agent разпознава различен тип информация.

Вместо ticket tool избира:

```text
get_api_documentation
```

Това демонстрира dynamic tool selection.

---

# 6. Demo 4 — Multi-Step Workflow + Sub-Agent

Това е основната демонстрация на проекта.

Стартирай:

```text
New Chat
```

Изпрати:

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

## Какво трябва да се случи

Очакваният flow е:

```text
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
Final Response
```

В backend terminal-а трябва да се вижда поне:

```text
[TOOL] get_ticket called with ticketId=DEV-101

[TOOL] get_api_documentation called with resource=Locations
```

Финалният отговор трябва да съдържа практически frontend implementation plan.

Например:

```text
Components

Services

Models

API calls

State handling

Loading states

Error handling

Pagination

Filters
```

## Какво да кажа

Това е съществената разлика между стандартен chatbot и Agent workflow.

Ние не сме написали:

```text
ако prompt съдържа DEV-101
извикай ticket tool
след това Locations tool
след това Frontend Specialist
```

Coordinator Agent сам определя кои capabilities са му необходими.

Това е multi-step agent orchestration.

---

# 7. Покажи Sub-Agent концепцията

## Какво да кажа

Frontend Specialist е отделен специализиран Agent.

Той не управлява разговора с потребителя.

Coordinator Agent събира информацията и делегира специализирания frontend анализ.

Архитектурата е:

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

Това е Agent-as-Tool подход.

Coordinator Agent запазва контрола върху workflow-а.

---

# 8. Demo 5 — Conversation Session

Стартирай:

```text
New Chat
```

Изпрати:

```text
Tell me about DEV-102.
```

След отговора, без да стартираш New Chat, изпрати:

```text
Which API does it use?
```

## Какво трябва да се случи

Agent-ът трябва да разбере, че:

```text
it = DEV-102
```

и да отговори:

```text
Events API
```

## Какво да кажа

Frontend-ът изпраща conversationId.

Backend-ът го свързва с Memory Session.

Затова следващите съобщения могат да използват контекста от разговора.

Workflow:

```text
conversationId
 ↓
Memory Session
 ↓
Previous Messages
 ↓
Coordinator Agent
```

---

# 9. Demo 6 — New Chat изолира контекста

След предишния тест натисни:

```text
New Chat
```

След това директно изпрати:

```text
Which API does it use?
```

## Какво трябва да се случи

Agent-ът трябва да поиска уточнение.

Например:

```text
Which ticket or feature are you referring to?
```

Не трябва произволно да отговаря:

```text
Locations
Events
Users
```

## Какво да кажа

New Chat създава нов conversation context.

Старият разговор вече не трябва да влияе на новия.

Това демонстрира session isolation.

---

# 10. Demo 7 — Guardrail

Преди теста DEV-102 трябва да е:

```text
OPEN
```

При нужда рестартирай backend-а, защото mock данните се пазят само в memory.

Изпрати:

```text
Change DEV-102 status to DONE.
```

## Business rule

Разрешеният flow е:

```text
OPEN
 ↓
IN_PROGRESS
 ↓
DONE
```

Следователно:

```text
OPEN → DONE
```

е невалиден transition.

## Какво трябва да се случи

Операцията трябва да бъде блокирана.

Не трябва да се появява Approval Card.

В terminal-а не трябва да се вижда:

```text
[TOOL] update_ticket_status executing: DEV-102 -> DONE
```

DEV-102 трябва да остане:

```text
OPEN
```

## Какво да кажа

Това е важна част от архитектурата.

Не разчитаме единствено на LLM-а да спазва business rules.

Имаме deterministic TypeScript validation.

Workflow:

```text
Agent requests action
 ↓
Guardrail
 ↓
Business rule validation
 ↓
Rejected
```

---

# 11. Demo 8 — Human Approval

Изпрати:

```text
Change DEV-102 status to IN_PROGRESS.
```

Този transition е валиден:

```text
OPEN → IN_PROGRESS
```

## Какво трябва да се случи

В интерфейса трябва да се появи:

```text
Human Approval Required
```

с информация:

```text
Tool:
update_ticket_status

Arguments:
DEV-102
IN_PROGRESS
```

и бутони:

```text
Reject

Approve
```

## Какво да кажа

Дори когато операцията е валидна, тя има side effect.

Затова Agent-ът няма право автоматично да я изпълни.

Workflow:

```text
User
 ↓
Agent
 ↓
Guardrail
 ↓
Valid action
 ↓
Human Approval
```

---

# 12. Покажи Reject

Натисни:

```text
Reject
```

## Какво трябва да се случи

Tool-ът не трябва да се изпълни.

DEV-102 трябва да остане:

```text
OPEN
```

## Какво да кажа

Тук човекът запазва крайния контрол.

Agent-ът може да предложи действие, но не може да го наложи.

---

# 13. Покажи Approve

Изпрати отново:

```text
Change DEV-102 status to IN_PROGRESS.
```

Този път натисни:

```text
Approve
```

## Какво трябва да се случи

В terminal:

```text
[TOOL] update_ticket_status executing: DEV-102 -> IN_PROGRESS
```

DEV-102 вече трябва да бъде:

```text
IN_PROGRESS
```

## Какво да кажа

При approval paused Agent workflow-ът се възстановява и tool-ът се изпълнява.

Пълният flow е:

```text
User Request
 ↓
Coordinator
 ↓
Tool Request
 ↓
Guardrail
 ↓
Approval Required
 ↓
Human Approves
 ↓
Resume Workflow
 ↓
Tool Execution
 ↓
Application State Changed
```

---

# 14. Покажи Tickets страницата

Отвори:

```text
Tickets
```

Избери:

```text
DEV-102
```

## Какво да покажеш

Статусът вече трябва да бъде:

```text
IN_PROGRESS
```

## Какво да кажа

Това доказва, че Agent-ът не само е генерирал текст.

Той е извършил реална application operation и промяната се вижда и в останалата част от системата.

---

# 15. Покажи Tracing

Ако има възможност по време на демонстрацията, отвори trace за:

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

## Какво да покажеш

Търси workflow приблизително:

```text
Agent Run

Coordinator

get_ticket

get_api_documentation

Frontend Specialist

Final Response
```

## Какво да кажа

Tracing позволява да наблюдаваме как Agent-ът е стигнал до резултата.

Това е важно при:

```text
debugging

monitoring

evaluation

analysis of tool usage
```

---

# 16. Финално обобщение

## Какво да кажа

Този Proof of Concept демонстрира, че AI Agent може да бъде повече от chatbot.

В реализирания проект Agent-ът може:

```text
да разбира natural-language request

да избира tools

да чете вътрешни данни

да използва няколко tools последователно

да делегира към Sub-Agent

да пази conversation context

да бъде ограничаван от deterministic rules

да изисква човешко approval

да извършва application actions
```

Основната архитектура е:

```text
User
 ↓
Coordinator Agent
 ↓
Tools / Sub-Agent
 ↓
Guardrails
 ↓
Human Approval
 ↓
Application
```

---

# 17. Основен извод

## Какво да кажа

Основният извод от PoC-а е, че Agent-based архитектурата е подходяща за процеси, при които:

- задачата може да има различен workflow;
- трябва да се използват различни вътрешни системи;
- следващата стъпка зависи от получената информация;
- естественият език е удобен интерфейс;
- част от действията трябва да останат под човешки контрол.

За строго определени и напълно предвидими операции стандартният application code остава по-подходящ.

Agent-ът има най-голяма стойност, когато трябва да координира различни capabilities според контекста.

---

# 18. Кратка версия на демонстрацията

Ако има само 3–5 минути:

## 1

```text
What are the requirements of DEV-101?
```

Покажи:

```text
get_ticket
```

## 2

```text
Analyze DEV-101 and give me a detailed Angular frontend implementation plan.
```

Покажи:

```text
multiple tools
+
Frontend Specialist
```

## 3

```text
Change DEV-102 status to DONE.
```

Покажи:

```text
Guardrail blocks invalid action
```

## 4

```text
Change DEV-102 status to IN_PROGRESS.
```

Покажи:

```text
Human Approval
```

Натисни:

```text
Approve
```

и покажи новия status в Tickets страницата.

---

# 19. Checklist преди презентация

Преди демонстрацията провери:

```text
[ ] Backend работи

[ ] Frontend работи

[ ] OPENAI_API_KEY е валиден

[ ] DEV-102 е OPEN

[ ] AI Playground работи

[ ] New Chat работи

[ ] get_ticket работи

[ ] get_api_documentation работи

[ ] Frontend Specialist работи

[ ] Guardrail работи

[ ] Approval card работи

[ ] Approve работи

[ ] Reject работи

[ ] Tracing е достъпно

[ ] Backend terminal е видим
```

Ако DEV-102 не е OPEN:

```text
рестартирай backend-а
```

за да се reset-нат mock данните.

---

# 20. Финален Project Message

Проектът е Proof of Concept за практическо използване на AI Agents в software development контекст.

Той демонстрира пълен Agent workflow:

```text
Natural Language
 ↓
Reasoning
 ↓
Tool Selection
 ↓
Internal Context
 ↓
Specialized Agent
 ↓
Deterministic Validation
 ↓
Human Control
 ↓
Application Action
```

Целта не е да бъде production-ready платформа, а да демонстрира основните building blocks, върху които по-късно могат да бъдат изградени реални вътрешни Agent-based решения.
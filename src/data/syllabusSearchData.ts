export interface SyllabusTopic {
  title: string;
  subject: string;
  query: string;
  category: 'Subject' | 'Topic';
}

export const searchableSyllabus: SyllabusTopic[] = [
  // Subjects
  {
    title: "BCS501 — Database Management System (DBMS)",
    subject: "BCS501",
    query: "Start teaching BCS501 Database Management System (DBMS) from Unit 1",
    category: "Subject"
  },
  {
    title: "BCS502 — Web Technology (WT)",
    subject: "BCS502",
    query: "Start teaching BCS502 Web Technology (WT) from Unit 1",
    category: "Subject"
  },
  {
    title: "BCS503 — Design and Analysis of Algorithm (DAA)",
    subject: "BCS503",
    query: "Start teaching BCS503 Design and Analysis of Algorithm (DAA) from Unit 1",
    category: "Subject"
  },
  {
    title: "BCS054 — Object Oriented System Design with C++ (OOSD)",
    subject: "BCS054",
    query: "Start teaching BCS054 Object Oriented System Design with C++ (OOSD) from Unit 1",
    category: "Subject"
  },
  {
    title: "BCS058 — Data Warehousing & Data Mining (DWDM)",
    subject: "BCS058",
    query: "Start teaching BCS058 Data Warehousing & Data Mining (DWDM) from Unit 1",
    category: "Subject"
  },
  {
    title: "BNC501 — Constitution of India (COI)",
    subject: "BNC501",
    query: "Start teaching BNC501 Constitution of India (COI) from Unit 1",
    category: "Subject"
  },

  // DBMS Topics
  {
    title: "Database System vs File System",
    subject: "BCS501 — DBMS",
    query: "Explain Database System vs File System with key differences and exam points",
    category: "Topic"
  },
  {
    title: "ER Model, Entity, Attributes & ER Diagram Notation",
    subject: "BCS501 — DBMS",
    query: "Explain ER Model, Entity Types, Attributes and ER Diagram Notation with an example diagram",
    category: "Topic"
  },
  {
    title: "Keys: Super Key, Candidate Key, Primary Key & Foreign Key",
    subject: "BCS501 — DBMS",
    query: "Explain Super Key, Candidate Key, Primary Key, and Foreign Key with table examples in DBMS",
    category: "Topic"
  },
  {
    title: "Relational Algebra & Relational Calculus",
    subject: "BCS501 — DBMS",
    query: "Explain Relational Algebra operators (Select, Project, Union, Cartesian Product, Joins) with examples",
    category: "Topic"
  },
  {
    title: "SQL Queries, Joins, Triggers, Views & Subqueries",
    subject: "BCS501 — DBMS",
    query: "Explain SQL Joins (Inner, Left, Right, Full), Views, Triggers, and Subqueries with schema examples",
    category: "Topic"
  },
  {
    title: "Normalization: 1NF, 2NF, 3NF & BCNF",
    subject: "BCS501 — DBMS",
    query: "Explain Functional Dependencies and Normalization forms (1NF, 2NF, 3NF, BCNF) with step-by-step table decomposition",
    category: "Topic"
  },
  {
    title: "Transaction Processing & ACID Properties",
    subject: "BCS501 — DBMS",
    query: "Explain Transaction Processing and ACID properties in DBMS with real-world examples",
    category: "Topic"
  },
  {
    title: "Serializability & Conflict/View Serializable Schedules",
    subject: "BCS501 — DBMS",
    query: "Explain Serializability of schedules, Conflict Serializability vs View Serializability, and testing precedence graph",
    category: "Topic"
  },
  {
    title: "Concurrency Control & 2PL (Two-Phase Locking)",
    subject: "BCS501 — DBMS",
    query: "Explain Concurrency Control techniques, Lock-based protocols, Strict 2PL, and Timestamp ordering protocol",
    category: "Topic"
  },
  {
    title: "Deadlock Handling & Database Recovery Protocols",
    subject: "BCS501 — DBMS",
    query: "Explain Deadlock detection and prevention, and Log-based Recovery (Deferred & Immediate modification with Checkpoints)",
    category: "Topic"
  },

  // Web Technology Topics
  {
    title: "HTML5 & XML (DTD, XML Schema, DOM vs SAX)",
    subject: "BCS502 — WT",
    query: "Explain XML concepts, DTD, XML Schema, and the difference between DOM and SAX parsers",
    category: "Topic"
  },
  {
    title: "CSS Box Model, Flexbox & Responsive Layouts",
    subject: "BCS502 — WT",
    query: "Explain the CSS Box Model (Border, Margin, Padding), Display, and Positioning with code examples",
    category: "Topic"
  },
  {
    title: "JavaScript Objects, Functions & AJAX",
    subject: "BCS502 — WT",
    query: "Explain JavaScript event handling, DOM manipulation, and asynchronous communication using AJAX",
    category: "Topic"
  },
  {
    title: "Node.js Architecture, Express.js & MongoDB",
    subject: "BCS502 — WT",
    query: "Explain Node.js event-driven architecture, Express framework RESTful API, and MongoDB CRUD operations",
    category: "Topic"
  },
  {
    title: "Java Servlets Architecture, Lifecycle & Session Tracking",
    subject: "BCS502 — WT",
    query: "Explain Servlet Architecture, Servlet Lifecycle (init, service, destroy), and Session Tracking using Cookies & HttpSession",
    category: "Topic"
  },
  {
    title: "JSP Architecture, Implicit Objects & Scripting Tags",
    subject: "BCS502 — WT",
    query: "Explain JSP Overview, Lifecycle, 9 Implicit Objects, Scripting elements, and Directives with examples",
    category: "Topic"
  },

  // DAA Topics
  {
    title: "Asymptotic Notations & Master Theorem",
    subject: "BCS503 — DAA",
    query: "Explain Asymptotic Notations (Big-O, Omega, Theta) and Master Theorem with solved recurrence examples",
    category: "Topic"
  },
  {
    title: "Sorting: Quick Sort, Merge Sort & Heap Sort",
    subject: "BCS503 — DAA",
    query: "Compare Quick Sort, Merge Sort, and Heap Sort with algorithm steps, worked example, time complexity, and space complexity",
    category: "Topic"
  },
  {
    title: "Red-Black Trees & B-Trees",
    subject: "BCS503 — DAA",
    query: "Explain Red-Black Tree properties, rotations, and B-Tree insertion and deletion with diagrams",
    category: "Topic"
  },
  {
    title: "Binomial Heaps & Fibonacci Heaps",
    subject: "BCS503 — DAA",
    query: "Explain Binomial Heaps and Fibonacci Heaps structure, operations, and amortized time complexity",
    category: "Topic"
  },
  {
    title: "Greedy: Minimum Spanning Trees (Prim's & Kruskal's)",
    subject: "BCS503 — DAA",
    query: "Explain Minimum Spanning Tree algorithms: Prim's vs Kruskal's algorithm with a step-by-step solved graph example",
    category: "Topic"
  },
  {
    title: "Shortest Paths: Dijkstra's & Bellman-Ford",
    subject: "BCS503 — DAA",
    query: "Explain Single Source Shortest Path: Dijkstra's Algorithm and Bellman-Ford Algorithm with negative weight cycle detection",
    category: "Topic"
  },
  {
    title: "Dynamic Programming: 0/1 Knapsack, LCS & Floyd-Warshall",
    subject: "BCS503 — DAA",
    query: "Explain Dynamic Programming concept and solve 0/1 Knapsack problem with step-by-step matrix table formulation",
    category: "Topic"
  },
  {
    title: "Backtracking & Branch-and-Bound: N-Queens, TSP",
    subject: "BCS503 — DAA",
    query: "Explain Backtracking using 4-Queens / 8-Queens Problem and compare with Branch and Bound for TSP",
    category: "Topic"
  },
  {
    title: "NP-Completeness, P vs NP, NP-Hard & Approximation",
    subject: "BCS503 — DAA",
    query: "Explain Theory of NP-Completeness: P, NP, NP-Complete, NP-Hard classes, and Cook's Theorem with examples",
    category: "Topic"
  },

  // OOSD Topics
  {
    title: "Object-Oriented Concepts & UML Conceptual Model",
    subject: "BCS054 — OOSD",
    query: "Explain Object-Oriented principles (Encapsulation, Polymorphism, Abstraction, Inheritance) and UML 3 Building Blocks",
    category: "Topic"
  },
  {
    title: "Class Diagrams & Object Diagrams with C++ Mapping",
    subject: "BCS054 — OOSD",
    query: "Explain Class Diagram notations (Association, Aggregation, Composition, Generalization) and map them to C++ code",
    category: "Topic"
  },
  {
    title: "Sequence Diagrams & Collaboration Diagrams",
    subject: "BCS054 — OOSD",
    query: "Explain Interaction Diagrams: Sequence Diagram vs Collaboration Diagram with a real-world system example",
    category: "Topic"
  },
  {
    title: "Use Case Diagrams, Activity Diagrams & State Machines",
    subject: "BCS054 — OOSD",
    query: "Explain Use Case Diagram notations (Actors, Include, Extend) and Activity Diagrams with swimlanes",
    category: "Topic"
  },
  {
    title: "C++ Virtual Functions, Pure Virtual Functions & Polymorphism",
    subject: "BCS054 — OOSD",
    query: "Explain Virtual Functions, Pure Virtual Functions, Abstract Classes, and Runtime Polymorphism in C++ with code",
    category: "Topic"
  },
  {
    title: "C++ Operator Overloading & Friend Functions",
    subject: "BCS054 — OOSD",
    query: "Explain Operator Overloading and Friend Functions in C++ with syntax and runnable code example",
    category: "Topic"
  },

  // DWDM Topics
  {
    title: "Data Warehouse Architecture & DBMS vs Data Warehouse",
    subject: "BCS058 — DWDM",
    query: "Explain Data Warehouse Architecture, Components, and the difference between Operational DBMS (OLTP) and Data Warehouse (OLAP)",
    category: "Topic"
  },
  {
    title: "Schemas: Star Schema, Snowflake Schema & Fact Constellation",
    subject: "BCS058 — DWDM",
    query: "Compare Star Schema, Snowflake Schema, and Fact Constellation Schema with diagrams and normalization differences",
    category: "Topic"
  },
  {
    title: "OLAP Operations: Roll-up, Drill-down, Slice, Dice & Pivot",
    subject: "BCS058 — DWDM",
    query: "Explain Multi-Dimensional Data Model, Data Cubes, and OLAP operations (Roll-up, Drill-down, Slice, Dice, Pivot)",
    category: "Topic"
  },
  {
    title: "Data Preprocessing: Cleaning, Integration, Transformation & Reduction",
    subject: "BCS058 — DWDM",
    query: "Explain Data Preprocessing steps: Handling Missing Values, Noisy Data (Binning), and Dimensionality Reduction",
    category: "Topic"
  },
  {
    title: "Classification: Decision Trees & ID3/C4.5 Algorithm",
    subject: "BCS058 — DWDM",
    query: "Explain Decision Tree Classification, Entropy, and Information Gain calculation with a numerical example",
    category: "Topic"
  },
  {
    title: "Clustering: K-Means, Hierarchical & DBSCAN",
    subject: "BCS058 — DWDM",
    query: "Explain Clustering methods: Partitioning (K-Means), Hierarchical (AGNES, DIANA), and Density-Based (DBSCAN)",
    category: "Topic"
  },
  {
    title: "Association Rule Mining & Apriori Algorithm",
    subject: "BCS058 — DWDM",
    query: "Explain Association Rule Mining (Support & Confidence) and solve Apriori Algorithm on a transactional dataset",
    category: "Topic"
  },

  // Constitution of India Topics
  {
    title: "Salient Features of Indian Constitution & The Preamble",
    subject: "BNC501 — COI",
    query: "Explain the Preamble and the Salient Features of the Indian Constitution for exam",
    category: "Topic"
  },
  {
    title: "Fundamental Rights (Articles 12-35) & Fundamental Duties",
    subject: "BNC501 — COI",
    query: "Explain the 6 Fundamental Rights, Right to Constitutional Remedies (Writs), and Fundamental Duties (Article 51A)",
    category: "Topic"
  },
  {
    title: "Directive Principles of State Policy (DPSP, Part IV)",
    subject: "BNC501 — COI",
    query: "Explain Directive Principles of State Policy (DPSP), their classification, and difference from Fundamental Rights",
    category: "Topic"
  },
  {
    title: "Union Executive: Powers of President & Prime Minister",
    subject: "BNC501 — COI",
    query: "Explain the Powers and Functions of the President of India and the Prime Minister under the Parliamentary system",
    category: "Topic"
  },
  {
    title: "Judiciary: Supreme Court Independence, Judicial Review & PIL",
    subject: "BNC501 — COI",
    query: "Explain Independence of Supreme Court of India, Judicial Review, and Public Interest Litigation (PIL)",
    category: "Topic"
  },
  {
    title: "Emergency Provisions: National, President's Rule & Financial",
    subject: "BNC501 — COI",
    query: "Explain Emergency Provisions under the Indian Constitution (Articles 352, 356, 360): grounds, procedure, and effects",
    category: "Topic"
  },
  {
    title: "Amendment of the Constitution: Article 368 Procedure",
    subject: "BNC501 — COI",
    query: "Explain the procedure for Amendment of the Indian Constitution under Article 368 and the Basic Structure Doctrine",
    category: "Topic"
  }
];

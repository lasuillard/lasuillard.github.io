---
title: AWS 자격증 (SAP-C02) 합격 후기
publicationDate: 2026-07-01
preview: ./preview.png
summary: >
  AWS Certified Solutions Architect - Professional 자격증 취득 과정 및 자잘한 팁
tags:
  - Amazon Web Services
  - Certification
---

최근 클라우드 엔지니어링 직무 전환을 준비하고 있습니다. AWS에 대해 배울 겸, 이직에 활용하기 위해 AWS 자격증을 준비하기로 결정했습니다.

시험 접수부터 합격 후 자격증 수령까지 2개월의 짧은 기록과 경험, 그리고 자잘한 팁에 대해 공유합니다.

## 🎓 AWS 자격증이란?

AWS 환경에서 시스템을 설계, 구현 및 관리하는 기술 역량을 검증하는 공식 인증 프로그램입니다. 그중에서도 Solutions Architect - Professional (SAP-C02)은 AWS 서비스 전반에 걸쳐 고도화된 비용 및 성능 최적화 솔루션을 설계하고 마이그레이션 전략을 수립하는 역량을 중점적으로 다룹니다.

AWS에서는 2년 이상의 포괄적인 AWS 실무 경험을 권장하고 있습니다.

![시험 환경](./assets/exam-logo.png)

저는 Associate 자격 없이 바로 Professional 시험에 응시했습니다. 이전 직장에서 1년 반 동안 EC2, VPC, S3, CloudFront, ACM, Route 53, RDS, Redshift, ECS, SSM 등 핵심 인프라 운영을 도맡다시피 했던 터라 '괜찮지 않을까?' 싶었습니다.

하지만 SAP-C02는 이러한 기본 코어 서비스를 기반으로 하되, 서비스 간의 세부 통합 기능, 멀티 리전/멀티 계정 아키텍처 설계, 그리고 엄격한 제약 조건을 다룹니다. 이미 다뤄본 서비스는 큰 도움이 되었지만, 실무에서 접해보지 못한 세부 기능이나 복합 설계 패턴은 생각보다 훨씬 방대하고 어려웠습니다.

## 📋 시험 접수하기

AWS는 시험 관리를 [Pearson](https://www.pearsonvue.com/us/en/test-takers.html)에 위탁하고 있습니다. SAP-C02의 정가 응시료는 300 USD(단순 환율 계산 시 약 47만 원 상당)이지만, 실제 결제 시에는 실시간 환율이 아닌 AWS에서 원화로 책정하는 [응시료 기준](https://aws.amazon.com/ko/certification/policies/before-testing/#Exam_pricing)(수수료 제외, 2026-07-01 기준 394,575 KRW)을 따릅니다. Pearson이나 Udemy 등 교육 기관에서 할인 바우처를 판매하는 경우가 많으니, 결제 전 혜택을 꼭 챙기시길 바랍니다.

온라인 감독 시험도 가능하지만, 저는 네트워크 불안정이나 소음 등의 변수를 배제하고 잘 통제된 환경에서 집중하기 위해 오프라인 시험장을 방문해 응시하기로 결정했습니다.

시험 접수 시 챙겨야 할 핵심 혜택은 다음과 같습니다.

### 🎟️ 할인 바우처

![할인 바우처](./assets/discount-voucher.png)

저는 Pearson에서 프로모션으로 판매하던 바우처를 구매하여 50% 할인을 받았습니다. 표기 금액은 수수료 제외 기준이며, 수수료를 포함해 최종 결제된 금액은 2026년 5월 7일 기준 221,833원이었습니다.

주의할 점은 바우처마다 적용 가능한 시험 등급(Foundational / Associate / Professional, Specialty)이 정해져 있다는 것입니다. 예를 들어 Foundational 전용 바우처는 Associate이나 Professional 시험에 사용할 수 없습니다.

바우처 결제 시 해외원화결제(DCC, Dynamic Currency Conversion) 차단 서비스로 인해 결제가 실패하는 경우가 있습니다. 카드사의 DCC 설정을 잠시 해제하고 결제해야 하며, 이 과정에서 약간의 환전 수수료가 발생할 수 있습니다. 그럼에도 정가 결제에 비하면 훨씬 저렴합니다.

### ⏱️ ESL (English as a Second Language)

영어가 모국어가 아닌 수험자는 ESL 편의 제공(Accommodation)을 요청하여 30분의 시험 시간을 추가로 받을 수 있습니다. 시험 접수 전 Pearson VUE 계정의 시험 편의 요청 메뉴에서 사전에 신청해야 적용됩니다. 방대한 지문을 검토할 수 있는 귀중한 시간이니 꼭 신청하시길 바랍니다.

## 📝 시험 준비하기

시험 준비를 위해 Udemy에서 [Stephane Maarek의 강의 과정](https://www.udemy.com/course/aws-solutions-architect-professional/) 1개와 실전 모의고사 문제집 2종([Stephane Maarek](https://www.udemy.com/course/practice-exam-aws-certified-solutions-architect-professional/), [Jon Bonso](https://www.udemy.com/course/aws-solutions-architect-professional-practice-exams-sap-c02/))을 구매했습니다. 총 준비 기간은 2개월로, 처음 5\~6주는 하루 2\~3시간씩 강의를 수강하며 개념을 정리했고, 마지막 2\~3주는 모의고사 풀이와 오답 분석에 집중했습니다.

강의를 모두 수강하더라도 방대한 양 때문에 모든 세부 내용을 기억하는 것은 불가능에 가깝습니다. 강의는 '무엇이 있고, 어디를 찾아봐야 하는지' 알려줄 뿐이며, 실제로 문제를 해결하는 능력은 모의고사를 통해 점검하고 오답을 분석하며 체득해야 합니다.

사설 모의고사는 실제 시험보다 다소 지엽적이고 까다로운 편입니다. 특히 Stephane Maarek의 모의고사는 [AWS 공식 샘플 시험 문항](https://d1.awsstatic.com/ko_KR/training-and-certification/docs-sa-pro/AWS-Certified-Solutions-Architect-Professional_Sample-Questions.pdf)과 비교했을 때 지문이 매우 장황하고 특정 서비스의 세부 한도나 수치 등 암기성 지식을 토대로 정답을 요구하는 문제가 많았습니다. 반면 Jon Bonso의 모의고사는 복합적인 비즈니스 요구사항과 비용/성능 제약 조건 하에서 최적의 아키텍처를 선택하도록 유도하여 실제 시험 및 공식 샘플 문제의 출제 경향과 체감상 훨씬 유사했습니다.

모의고사 결과는 다음과 같았습니다.

| 모의고사                                                     | 테스트 회차           | 결과 (맞은 개수 / 총 개수) | 정답률 (%) |
| ------------------------------------------------------------ | --------------------- | -------------------------- | ---------- |
| Practice Exam AWS Certified Solutions Architect Professional | Mini Practice Test #1 | 18 / 30                    | 60%        |
|                                                              | Full Practice Test #2 | 41 / 75                    | 54%        |
|                                                              | Full Practice Test #3 | 45 / 75                    | 60%        |
| AWS Certified Solutions Architect Professional Practice Exam | Practice Test 1       | 51 / 75                    | 68%        |
|                                                              | Practice Test 2       | 59 / 75                    | 78%        |
|                                                              | Practice Test 3       | 61 / 75                    | 81%        |
|                                                              | Practice Test 4       | 52 / 75                    | 69%        |

초반 모의고사에서 정답률이 50\~60%대에 머물러 합격선(750점)에 미치지 못했을 때는 좌절감도 컸습니다. 하지만 모의고사 점수에 너무 연연하지 않는 마인드 컨트롤이 중요합니다. 틀린 문제마다 관련 AWS 공식 문서 풀이를 분석하며 '출제자가 어떤 아키텍처 트레이드오프를 묻고 있는지'를 파악하고, 오답 노트를 정리하며 점차 실전 감각을 끌어올릴 수 있었습니다.

추가로 [AWS Skill Builder](https://explore.skillbuilder.aws/)에서도 다양한 학습 자료를 제공합니다. 저는 직접 유료 구독($29/월)을 이용하지는 않았지만, Reddit 등 해외 커뮤니티 후기에 따르면 공식 모의고사(Official Practice Exam)가 실제 시험 문제 유형을 체험해 보기에 가장 좋다는 평가가 있으니 참고해 보셔도 좋겠습니다.

![AWS Skill Builder](./assets/skill-builder.png)

## ⏳ 응시 절차

시험 시간은 09:15 예약이었으나 08:30경 시험장에 일찍 도착했습니다. 감독관 안내에 따라 대기 없이 곧바로 입실 절차를 진행할 수 있었으며, 시험장에는 10~20분 정도의 다른 수험자분들이 계셨습니다.

1.  **사물함에 모든 소지품 보관**

    주머니까지 완전히 비워야 합니다. 스마트폰과 스마트워치는 전원을 끈 후 사물함에 보관했습니다.

2.  **신분증 제시 (2개 이상)**

    감독관의 요청에 따라 여권과 국문 운전면허증을 제시했습니다.

    신분증을 하나만 지참하셨던 다른 응시자는 감독관 안내에 따라 서명된 신용/체크카드를 보조 신분증으로 대신 제출하셨습니다. 시험장과 감독관에 따라 규정 적용이 다소 다를 수 있으니 유효 신분증 2개를 꼭 챙겨가시길 권장합니다.

3.  **시험 안내 및 동의서 작성**

    시험 주의사항이 적힌 안내 문서(양면)를 읽고, 규정 준수 및 위반 시 불이익에 동의하는 서약서에 서명합니다.

4.  **입실 시간 기록 및 서명**

5.  **지정 좌석 착석 및 응시 환경 점검**

    지정된 좌석에 앉아 대기하면 감독관이 응시 환경을 세팅해 줍니다. 자리마다 메모용 화이트보드와 마커가 제공되나, 실전에서는 거의 사용하지 않았습니다.

6.  **시험 응시**

    기본 시험 시간 180분에 ESL 추가 시간(30분)이 더해지고, 사전 안내 및 사후 설문조사 시간(10분)까지 포함되어 실제 화면에는 총 220분이 주어집니다.

    1.  **시험 응시 전 안내사항 확인 및 비밀유지서약(NDA, Non-Disclosure Agreement) 동의**
    2.  **시험 응시 (210분)**

        시험 환경은 매우 쾌적했습니다. 지문이 긴 문제가 연속되어 후반부로 갈수록 집중력 유지가 핵심이었는데, 확신이 서지 않는 문제는 일단 플래그(Flag) 표시를 해두고 빠르게 넘기며 1회독을 마쳤습니다. 전체 문제 중 절반 정도를 플래그해 두었고, 약 40분을 남긴 시점부터 플래그한 문제들을 하나씩 다시 검토했습니다.

        한국어로 응시하더라도 버튼 하나로 손쉽게 영어 원문을 교차 확인할 수 있습니다. 한국어 번역이 모호하게 느껴지는 경우가 많아 플래그해 둔 대부분의 문제는 영어 원문을 함께 대조하며 풀었고, 이 방식이 정답을 확신하는 데 큰 도움이 되었습니다.

    3.  **시험 응시 후 설문조사**

        난이도 및 수험 환경 만족도에 대한 간단한 설문조사를 마친 후 시험이 종료됩니다.

7.  **퇴실 시간 기록 및 서명**

## 🪪 결과

최종 점수 841점으로 합격했습니다. 시험 당일 저녁 결과를 받았다는 후기도 있어 기대하며 기다렸지만 당일에는 오지 않았습니다. 다음 날 오전 6시에 [Credly](https://info.credly.com/)로부터 디지털 배지 발급 메일을 먼저 받았고, 공식 AWS 합격 통보 메일은 정오 12시경에 수신했습니다.

![합격 통보 이메일](./assets/aws-email.png)

수험 커뮤니티의 후기처럼 AWS 공식 메일보다 Credly 배지 발급 알림이 먼저 오는 경우가 많으니 참고하시면 좋습니다.

## ✨ 혜택

자격증을 취득하면 유효 기간(3년) 동안 이후 다른 AWS 자격 시험에 응시할 때 사용할 수 있는 50% 할인 바우처와 [Subject Matter Expert (SME)](https://aws.amazon.com/ko/certification/certification-sme-program/) 프로그램 참가 자격이 주어집니다. SME는 AWS 공인 자격증 시험 문제 출제 및 검토 과정에 참여하는 온/오프라인 전문가 프로그램입니다.

또한 [AWS Skill Builder](https://skillbuilder.aws/certification/recertification)를 통해 만료 전 6개월 이내에 자격증을 1년 연장(Recertification)할 수 있는 옵션도 제공됩니다.

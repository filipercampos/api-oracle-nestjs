/**
* CREATE Table API001_USU MNEMONIC
*/
CREATE TABLE APP001.API001_USU (
    USU_ID NUMBER GENERATED ALWAYS AS IDENTITY,
    USU_CPF VARCHAR2(11) NOT NULL UNIQUE,
    USU_PFL VARCHAR2(45) NOT NULL,
    USU_EML VARCHAR2(200) NOT NULL UNIQUE,
    USU_FRT_NAM VARCHAR2(45) ,
    USU_LST_NAM VARCHAR2(4000),
    USU_STS NUMBER(1,0) DEFAULT 1,
    USU_CRT_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    USU_UPD_AT TIMESTAMP NULL,
    USU_PSW VARCHAR2(60) NOT NULL,
    PRIMARY KEY (USU_ID)
);
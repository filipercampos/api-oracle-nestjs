Creating an Oracle database user for the target database
An Oracle database user is required to log in to the database and perform SnapManager operations. You must create this user with the sysdba privilege if a user with the sysdba privilege does not exist for the target database.

About this task
SnapManager can use any Oracle user with the sysdba privilege that exists for the target database. For example, SnapManager can use the default sys user. However, even if the user exists, you can create a new user for the target database and assign the sysdba privilege.

You can also use the OS authentication method wherein the operating system (OS) allows the Oracle database to use the credentials that are maintained by the OS to authenticate users to log in to the database and perform SnapManager operations. If you are authenticated by the OS, you can connect to the Oracle database without specifying a user name or password.

Steps
Log in to SQL *Plus:
```
sqlplus '/ as sysdba'
```
Create a new user with an administrator password:
```
create user user_name identified by admin_password;
```
user_name is the name of the user you are creating and admin_password is the password that you want to assign to the user.

Assign the sysdba privilege to the new Oracle user:
```
grant sysdba to user_name;
```

Error
that was not valid for common users or roles.  In addition to
the usual rules for user and role names, common user and role
names must start with C## or c## and consist only of ASCII
characters.
Use
```
alter session set "_ORACLE_SCRIPT"=true;
```
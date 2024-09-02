-- INSERT, UPDATE, DELETER on user
CREATE TRIGGER update_staff_secure_view_after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;

CREATE TRIGGER update_staff_secure_view_after_user_update
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;

CREATE TRIGGER update_staff_secure_view_after_user_delete
AFTER DELETE ON user
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;

-- UPDATE on staff
CREATE TRIGGER update_staff_secure_view_after_staff_update
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;
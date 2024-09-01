-- INSERT, UPDATE, DELETER on staff
CREATE TRIGGER update_staff_secure_view_after_staff_insert
AFTER INSERT ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;

CREATE TRIGGER update_staff_secure_view_after_staff_update
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;

CREATE TRIGGER update_staff_secure_view_after_staff_insert
AFTER DELETE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_view();
END;
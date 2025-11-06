-- Table des notifications
USE elibrary;

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('loan_approved', 'loan_rejected', 'return_reminder', 'overdue') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mise à jour table loans pour le statut
ALTER TABLE loans ADD COLUMN status ENUM('pending', 'approved', 'rejected', 'returned') DEFAULT 'pending';

-- Trigger pour créer notification lors d'approbation
DELIMITER //
CREATE TRIGGER loan_approved_notification
AFTER UPDATE ON loans
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (user_id, type, title, message)
        SELECT 
            NEW.user_id,
            'loan_approved',
            'Demande d\'emprunt acceptée',
            CONCAT('Votre demande d\'emprunt pour "', b.title, '" a été acceptée. Vous pouvez récupérer le livre.')
        FROM books b WHERE b.id = NEW.book_id;
    END IF;
END//
DELIMITER ;
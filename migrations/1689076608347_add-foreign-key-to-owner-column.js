/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Membuat user baru.
  pgm.sql("INSERT INTO users VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')")

  // Membuat nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL")

  // Memberikan nilai constraint foreign key pada owner terhadap kolom id dari tabler users
  pgm.addConstraint("notes", "fk_notes.owner_users_id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE")
};

exports.down = pgm => {
  // Menghapus constraint fk_notes.owner_users.id pada table notes
  pgm.dropConstraint("notes", 'fk_notes.owner_users_id')

  // Mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE note SET owner = null WHERE owner = 'old_notes'")

  // Menghapus user baru
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'")
};
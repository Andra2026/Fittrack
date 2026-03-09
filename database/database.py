import sqlite3

conn = sqlite3.connect("fittrack.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS peso (
id INTEGER PRIMARY KEY AUTOINCREMENT,
peso REAL,
data TEXT
)
""")

conn.commit()
conn.close()

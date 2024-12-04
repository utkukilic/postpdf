import sys
text_array = ""
def open_file(file_path):
    try:
        with open(file_path, 'r') as file:
            return file.readlines()
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def read_text_file(file_path):
    text = open_file(file_path)
    text_array = [line.strip().split() for line in text]
    ##for line in text_array:
        ##print(line)
        
    return text_array
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <text_file_path>")
    else:
        text_file_path = sys.argv[1]
        read_text_file(text_file_path)
        print(text_array[0])
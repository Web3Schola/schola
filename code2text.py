import os
import fnmatch

def should_include_file(filename):
    # Add or remove patterns as needed
    patterns = ['*.js', '*.jsx', '*.ts', '*.tsx', '*.css', '*.scss', '*.env', '*.html', '*.json', '*.md']
    return any(fnmatch.fnmatch(filename, pattern) for pattern in patterns)

def should_exclude_dir(dirname):
    # Add any directories you want to exclude
    exclude = ['node_modules', '.git', '.next']
    return dirname in exclude

def process_directory(directory, output_file):
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if not should_exclude_dir(d)]

        for file in files:
            if should_include_file(file):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, directory)

                output_file.write(f"\n\n// File: {relative_path}\n")

                with open(file_path, 'r', encoding='utf-8') as input_file:
                    output_file.write(input_file.read())

def main():
    project_dir = '.'  # Current directory, change if needed
    output_filename = 'nextjs_app.txt'

    with open(output_filename, 'w', encoding='utf-8') as output_file:
        process_directory(project_dir, output_file)

    print(f"Combined Next.js app code written to {output_filename}")

if __name__ == "__main__":
    main()

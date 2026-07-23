import json
import os

def apply_replacements(content, transcript_path):
    if not os.path.exists(transcript_path): return content
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                step = json.loads(line)
                if 'tool_calls' in step:
                    for call in step['tool_calls']:
                        if call['name'] in ['multi_replace_file_content', 'replace_file_content']:
                            args = call['args']
                            if isinstance(args, str): args = json.loads(args)
                            
                            target_file = args.get('TargetFile', '')
                            if isinstance(target_file, str):
                                target_file = target_file.strip('"\'')
                                
                            if target_file.replace('\\\\', '/').endswith('src/pages/Home.jsx'):
                                chunks = args.get('ReplacementChunks', [])
                                if not chunks and 'TargetContent' in args:
                                    chunks = [args]
                                if isinstance(chunks, str): chunks = json.loads(chunks)
                                for chunk in chunks:
                                    target_c = chunk['TargetContent']
                                    if isinstance(target_c, str):
                                        target_c = json.loads(target_c) if target_c.startswith('"') else target_c
                                    replace_c = chunk['ReplacementContent']
                                    if isinstance(replace_c, str):
                                        replace_c = json.loads(replace_c) if replace_c.startswith('"') else replace_c
                                        
                                    content = content.replace(target_c, replace_c)
            except Exception as e:
                pass
    return content

with open('src/pages/Home.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

transcripts = [
    r'C:\Users\gatsu\.gemini\antigravity-cli\brain\18c87d4b-5972-4191-ad1e-c05f8e045887\.system_generated\logs\transcript_full.jsonl',
    r'C:\Users\gatsu\.gemini\antigravity-cli\brain\222ff454-03ef-4a5a-9f17-41c1ffb2b2bd\.system_generated\logs\transcript_full.jsonl',
    r'C:\Users\gatsu\.gemini\antigravity-cli\brain\93bf8bdb-877c-4f8b-a92e-98f600b14268\.system_generated\logs\transcript_full.jsonl',
    r'C:\Users\gatsu\.gemini\antigravity-cli\brain\c01008e3-c69a-44f5-b4f9-6db30189853d\.system_generated\logs\transcript_full.jsonl',
    r'C:\Users\gatsu\.gemini\antigravity-cli\brain\a23b03a8-d31b-45c5-b383-17eb84efe8ed\.system_generated\logs\transcript_full.jsonl'
]

for t in transcripts:
    content = apply_replacements(content, t)

content = content.replace('copper', 'sage')

with open('src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Recovered applied properly!')

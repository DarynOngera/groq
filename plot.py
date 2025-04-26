import matplotlib.pyplot as plt
import numpy as np

# Data
platforms = ['WhatsApp', 'ChatGPT', 'Gemini', 'Copilot', 'DeepSeek', 'Perplexity', 'Grok']
users = [2_000_000_000, 180_000_000, 100_000_000, 50_000_000, 10_000_000, 10_000_000, 1_000_000]

# Convert to millions for cleaner labeling
users_in_millions = [u / 1_000_000 for u in users]

# Plot
plt.figure(figsize=(12, 6))
bars = plt.bar(platforms, users_in_millions, color=['#25D366', '#10A37F', '#0F9D58', '#0078D4', '#1DA1F2', '#404040', '#FF7043'])

# Annotate values
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height,
             f'{height:.1f}M' if height >= 1 else f'{height:.1f}M',
             ha='center', va='bottom', fontsize=9)

# Labels and title
plt.xlabel('Platforms', fontsize=12)
plt.ylabel('Active Users (Millions)', fontsize=12)
plt.title('Comparison of Active Users Across Platforms (2024)', fontsize=14, pad=20)
plt.xticks(rotation=45, ha='right')
plt.yscale('log')  # Logarithmic scale for better visualization of smaller values

plt.tight_layout()
plt.show()

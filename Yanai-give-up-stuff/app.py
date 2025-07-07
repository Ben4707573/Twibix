import tkinter as tk
from tkinter import ttk, messagebox
import csv
import os
from datetime import datetime

class ScenarioManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Scenario Manager")
        self.root.attributes('-fullscreen', True)  # Start in fullscreen mode
        self.root.bind('<F11>', lambda e: self.root.attributes('-fullscreen', not self.root.attributes('-fullscreen')))  # Toggle fullscreen
        self.root.bind('<Escape>', lambda e: self.root.attributes('-fullscreen', False))  # Exit fullscreen
        self.root.configure(bg="#2c2c2c")
        
        # Modern color scheme
        self.colors = {
            'bg': '#2c2c2c',
            'card_bg': '#3c3c3c',
            'accent': '#4a9eff',
            'accent_hover': '#3d8bdb',
            'text': '#ffffff',
            'text_secondary': '#b0b0b0',
            'success': '#4caf50',
            'danger': "#1b3853",
            'border': '#555555'
        }
        
        # Configure modern style
        self.setup_style()
        
        # CSV file path
        self.csv_file = "/home/bengo/Documents/programing/Yanai-give-up-stuff/scenarios.csv"
        
        # Initialize CSV file if it doesn't exist
        self.init_csv_file()
        
        # Create GUI
        self.create_widgets()
        
        # Load existing scenarios
        self.load_scenarios()
    
    def setup_style(self):
        """Setup modern styling for ttk widgets"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure styles
        style.configure('Modern.TFrame', background=self.colors['bg'])
        style.configure('Card.TFrame', background=self.colors['card_bg'], relief='flat', borderwidth=1)
        style.configure('Modern.TLabel', background=self.colors['bg'], foreground=self.colors['text'], font=('Segoe UI', 10))
        style.configure('Title.TLabel', background=self.colors['bg'], foreground=self.colors['text'], font=('Segoe UI', 24, 'bold'))
        style.configure('Heading.TLabel', background=self.colors['card_bg'], foreground=self.colors['text'], font=('Segoe UI', 12, 'bold'))
        style.configure('Modern.TEntry', fieldbackground=self.colors['card_bg'], foreground=self.colors['text'], borderwidth=1, relief='solid')
        style.configure('Modern.TButton', background=self.colors['accent'], foreground='white', borderwidth=0, focuscolor='none', font=('Segoe UI', 10))
        style.map('Modern.TButton', background=[('active', self.colors['accent_hover'])])
        style.configure('Danger.TButton', background=self.colors['danger'], foreground='white', borderwidth=0, focuscolor='none', font=('Segoe UI', 10))
        style.map('Danger.TButton', background=[('active', '#d32f2f')])
        
        # Modern Treeview styling
        style.configure('Modern.Treeview', background=self.colors['card_bg'], foreground=self.colors['text'], 
                       fieldbackground=self.colors['card_bg'], borderwidth=0, font=('Segoe UI', 10))
        style.configure('Modern.Treeview.Heading', background=self.colors['accent'], foreground='white', 
                       borderwidth=0, font=('Segoe UI', 11, 'bold'))
        style.map('Modern.Treeview', background=[('selected', self.colors['accent'])])
    
    def init_csv_file(self):
        """Initialize the CSV file with headers if it doesn't exist"""
        if not os.path.exists(self.csv_file):
            with open(self.csv_file, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(['ID', 'Scenario', 'Date Added'])
    
    def create_widgets(self):
        """Create all GUI widgets with modern design"""
        # Main container
        main_container = tk.Frame(self.root, bg=self.colors['bg'])
        main_container.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Title section
        title_frame = tk.Frame(main_container, bg=self.colors['bg'])
        title_frame.pack(fill='x', pady=(0, 30))
        
        title_label = ttk.Label(title_frame, text="📝 Scenario Manager", style='Title.TLabel')
        title_label.pack()
        
        subtitle_label = ttk.Label(title_frame, text="Organize and manage your scenarios", 
                                  font=('Segoe UI', 12), foreground=self.colors['text_secondary'],
                                  background=self.colors['bg'])
        subtitle_label.pack(pady=(5, 0))
        
        # Add scenario card
        add_card = ttk.Frame(main_container, style='Card.TFrame', padding=20)
        add_card.pack(fill='x', pady=(0, 20))
        
        add_heading = ttk.Label(add_card, text="✨ Add New Scenario", style='Heading.TLabel')
        add_heading.pack(anchor='w', pady=(0, 15))
        
        # Input section
        input_frame = tk.Frame(add_card, bg=self.colors['card_bg'])
        input_frame.pack(fill='x')
        
        self.scenario_entry = ttk.Entry(input_frame, font=('Segoe UI', 12), style='Modern.TEntry')
        self.scenario_entry.pack(side='left', fill='x', expand=True, ipady=8)
        self.scenario_entry.bind('<Return>', lambda e: self.add_scenario())
        
        add_button = ttk.Button(input_frame, text="Add Scenario", style='Modern.TButton', 
                               command=self.add_scenario)
        add_button.pack(side='right', padx=(15, 0), ipady=5)
        
        # Scenarios list card
        list_card = ttk.Frame(main_container, style='Card.TFrame', padding=20)
        list_card.pack(fill='both', expand=True)
        
        # List header with stats
        list_header = tk.Frame(list_card, bg=self.colors['card_bg'])
        list_header.pack(fill='x', pady=(0, 15))
        
        list_heading = ttk.Label(list_header, text="📋 Your Scenarios", style='Heading.TLabel')
        list_heading.pack(side='left')
        
        self.stats_label = ttk.Label(list_header, text="", font=('Segoe UI', 10),
                                    foreground=self.colors['text_secondary'], background=self.colors['card_bg'])
        self.stats_label.pack(side='right')
        
        # Treeview container
        tree_container = tk.Frame(list_card, bg=self.colors['card_bg'])
        tree_container.pack(fill='both', expand=True)
        
        # Treeview for scenarios
        columns = ('ID', 'Scenario', 'Date Added')
        self.tree = ttk.Treeview(tree_container, columns=columns, show='headings', 
                                style='Modern.Treeview', height=15)
        
        # Define headings
        self.tree.heading('ID', text='ID')
        self.tree.heading('Scenario', text='Scenario')
        self.tree.heading('Date Added', text='Date Added')
        
        # Configure column widths
        self.tree.column('ID', width=60, minwidth=60)
        self.tree.column('Scenario', width=500, minwidth=300)
        self.tree.column('Date Added', width=180, minwidth=150)
        
        # Scrollbar for treeview
        scrollbar = ttk.Scrollbar(tree_container, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        self.tree.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')
        
        # Action buttons
        action_frame = tk.Frame(list_card, bg=self.colors['card_bg'])
        action_frame.pack(fill='x', pady=(20, 0))
        
        refresh_button = ttk.Button(action_frame, text="🔄 Refresh", style='Modern.TButton',
                                   command=self.load_scenarios)
        refresh_button.pack(side='left', padx=(0, 10))
        
        remove_button = ttk.Button(action_frame, text="🗑️ Remove", style='Danger.TButton',
                                  command=self.remove_scenario)
        remove_button.pack(side='left')
    
    def add_scenario(self):
        """Add a new scenario to the CSV file"""
        scenario_text = self.scenario_entry.get().strip()
        
        if not scenario_text:
            messagebox.showwarning("Warning", "Please enter a scenario!")
            return
        
        # Get next ID
        next_id = self.get_next_id()
        
        # Current date
        current_date = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # Add to CSV
        try:
            with open(self.csv_file, 'a', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow([next_id, scenario_text, current_date])
            
            # Clear entry
            self.scenario_entry.delete(0, tk.END)
            
            # Reload scenarios
            self.load_scenarios()
            
            # Show success feedback (subtle, no popup)
            self.show_feedback("✅ Scenario added successfully!", self.colors['success'])
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add scenario: {str(e)}")
    
    def show_feedback(self, message, color):
        """Show temporary feedback message"""
        # Create temporary feedback label
        feedback = tk.Label(self.root, text=message, bg=color, fg='white', 
                           font=('Segoe UI', 10, 'bold'), padx=20, pady=10)
        feedback.place(relx=0.5, rely=0.95, anchor='center')
        
        # Remove feedback after 2 seconds
        self.root.after(2000, feedback.destroy)
    
    def get_next_id(self):
        """Get the next available ID"""
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                ids = [int(row[0]) for row in reader if row and row[0].isdigit()]
                return max(ids) + 1 if ids else 1
        except:
            return 1
    
    def load_scenarios(self):
        """Load scenarios from CSV file into the treeview"""
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                
                scenarios = list(reader)
                total_count = len([row for row in scenarios if len(row) >= 3])
                
                for row in scenarios:
                    if len(row) >= 3:
                        scenario_id, scenario, date_added = row
                        self.tree.insert('', 'end', values=(scenario_id, scenario, date_added))
                
                # Update statistics
                self.stats_label.config(text=f"Total scenarios: {total_count}")
                
        except FileNotFoundError:
            messagebox.showerror("Error", "CSV file not found!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load scenarios: {str(e)}")
    
    def get_selected_scenario(self):
        """Get the selected scenario from the treeview"""
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("Warning", "Please select a scenario!")
            return None
        
        item = self.tree.item(selected_item[0])
        return item['values'][0]  # Return the ID
    
    def remove_scenario(self):
        """Remove selected scenario from the CSV file"""
        scenario_id = self.get_selected_scenario()
        if not scenario_id:
            return
        
        # Confirm deletion
        if not messagebox.askyesno("Confirm Delete", 
                                  "Are you sure you want to remove this scenario?\n\nThis action cannot be undone."):
            return
        
        try:
            # Read all data
            rows = []
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                rows = list(reader)
            
            # Remove the specific row
            rows = [row for row in rows if not (len(row) >= 3 and row[0] == str(scenario_id))]
            
            # Write back to file
            with open(self.csv_file, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerows(rows)
            
            # Reload scenarios
            self.load_scenarios()
            
            # Show success feedback
            self.show_feedback("🗑️ Scenario removed successfully!", self.colors['danger'])
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to remove scenario: {str(e)}")

def main():
    root = tk.Tk()
    app = ScenarioManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
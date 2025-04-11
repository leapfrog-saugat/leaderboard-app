import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Trash2, Plus } from 'lucide-react';

const categories = [
  'Foundation Models',
  'Open Source Models',
  'Code Generation',
  'Multimodal Capabilities',
  'Search/Knowledge Integration',
  'Enterprise Adoption',
  'Speed/Latency',
  'Accuracy/Evaluation Benchmarks',
  'Tool Ecosystem',
  'Safety & Alignment',
];

const defaultAITools = [
  'GPT-4',
  'GPT-4 Turbo',
  'Claude 3 Opus',
  'Claude 3 Sonnet',
  'Gemini Pro',
  'Gemini Ultra',
  'Llama 2',
  'Mistral Large',
  'Code Llama',
  'StarCoder',
  'DALL·E 3',
  'Midjourney V6',
  'Stable Diffusion XL',
  'Anthropic Claude',
  'Palm 2',
  'Copilot',
  'CodeWhisperer',
  'Bard',
  'Mixtral 8x7B',
  'Yi-34B',
  'Qwen-72B',
];

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const formatDate = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).format(d);
};

const formatDateTime = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CreatableSelect = ({ value, onChange, options, placeholder, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleNewOption = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setIsEditing(false);
      setInputValue('');
    }
  };

  if (isEditing) {
    return (
      <div className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type and press Enter"
          className={className}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNewOption();
            } else if (e.key === 'Escape') {
              setIsEditing(false);
              setInputValue('');
            }
          }}
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(false);
            setInputValue('');
          }}
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === 'create-new') {
            setIsEditing(true);
          } else {
            onChange(e.target.value);
          }
        }}
        className={`border rounded p-2 w-full ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.sort().map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="create-new">+ Add new option...</option>
      </select>
    </div>
  );
};

export default function AIDashboard() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('aiLeaderboardEntries');
    const initial = saved
      ? JSON.parse(saved)
      : [{
          date: new Date().toISOString(),
          category: categories[0],
          leader: '',
          runnerUp: '',
          notes: '',
        }];
    return initial.map(entry => ({
      ...entry,
      id: entry.id || generateId(),
      date: entry.date || new Date().toISOString()
    }));
  });

  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [searchText, setSearchText] = useState('');
  const [editingDateId, setEditingDateId] = useState(null);
  const [aiTools, setAiTools] = useState(() => {
    const saved = localStorage.getItem('aiTools');
    return saved ? JSON.parse(saved) : defaultAITools;
  });

  useEffect(() => {
    localStorage.setItem('aiLeaderboardEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('aiTools', JSON.stringify(aiTools));
  }, [aiTools]);

  const handleChange = (id, key, value) => {
    const updated = entries.map(entry =>
      entry.id === id
        ? { 
            ...entry, 
            [key]: key === 'date' 
              ? new Date(value).toISOString()
              : value 
          }
        : entry
    );
    setEntries(updated);

    // Add new AI tool to the list if it doesn't exist
    if ((key === 'leader' || key === 'runnerUp') && value && !aiTools.includes(value)) {
      setAiTools([...aiTools, value]);
    }
  };

  const addRow = () => {
    setEntries([
      ...entries,
      {
        id: generateId(),
        date: new Date().toISOString(),
        category: categories[0],
        leader: '',
        runnerUp: '',
        notes: '',
      },
    ]);
  };

  const deleteRow = (id) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
  };

  const getLeaderColor = (leader) => {
    if (!leader) return 'text-black';
    const top = entries.filter((e) => e.leader === leader).length;
    if (top > 3) return 'text-green-600 font-semibold';
    if (top > 1) return 'text-yellow-600';
    return 'text-black';
  };

  const handleDateClick = (id) => {
    setEditingDateId(id);
  };

  const handleDateBlur = () => {
    setEditingDateId(null);
  };

  const filteredEntries = entries.filter((entry) => {
    const categoryMatch = filterCategory ? entry.category === filterCategory : true;
    const searchMatch =
      entry.leader.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.runnerUp.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchText.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'leader') return a.leader.localeCompare(b.leader);
    return 0;
  });

  return (
    <div className='p-6 grid gap-6'>
      <Card>
        <CardContent className='p-4'>
          <h2 className='text-xl font-bold mb-4'>Editable AI Leaderboard</h2>
          <div className='mb-4 flex flex-wrap gap-2 items-center'>
            <label className='font-medium'>Filter by Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='border rounded p-2'
            >
              <option value=''>All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className='font-medium ml-4'>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='border rounded p-2'
            >
              <option value='date'>Date</option>
              <option value='category'>Category</option>
              <option value='leader'>Leader</option>
            </select>
            <label className='font-medium ml-4'>Search:</label>
            <Input
              type='text'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search leader, runner-up, or notes'
              className='w-64'
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Runner-up</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell onClick={() => handleDateClick(entry.id)}>
                    {editingDateId === entry.id ? (
                      <Input
                        type='datetime-local'
                        value={formatDateTime(entry.date)}
                        onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
                        onBlur={handleDateBlur}
                        autoFocus
                      />
                    ) : (
                      <div className='cursor-pointer'>
                        {formatDate(entry.date)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <select
                      value={entry.category}
                      onChange={(e) => handleChange(entry.id, 'category', e.target.value)}
                      className='border rounded p-2 w-full'
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <CreatableSelect
                      value={entry.leader}
                      onChange={(value) => handleChange(entry.id, 'leader', value)}
                      options={aiTools}
                      placeholder="Select or create leader..."
                      className={getLeaderColor(entry.leader)}
                    />
                  </TableCell>
                  <TableCell>
                    <CreatableSelect
                      value={entry.runnerUp}
                      onChange={(value) => handleChange(entry.id, 'runnerUp', value)}
                      options={aiTools}
                      placeholder="Select or create runner-up..."
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.notes}
                      onChange={(e) => handleChange(entry.id, 'notes', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant='ghost' onClick={() => deleteRow(entry.id)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='mt-4'>
            <Button onClick={addRow}>Add Row</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

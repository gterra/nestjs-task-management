import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'user',
  id: 'someId',
  password: 'password',
  tasks: [],
};

const mockTask = {
  title: 'mock test title',
  description: 'mock test description',
  id: 'taskId',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue([mockTask]);
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('taskId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('taskId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

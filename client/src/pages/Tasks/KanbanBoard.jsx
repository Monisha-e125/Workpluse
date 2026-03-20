import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchKanbanTasks, updateColumns } from '../../store/slices/kanbanSlice';
import taskService from '../../services/taskService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import TaskCard from '../../components/kanban/TaskCard';
import CreateTaskModal from '../../components/kanban/CreateTaskModal';

const KanbanBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const { columns, columnOrder, isLoading } = useSelector((s) => s.kanban);
  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState('backlog');

  const loadBoard = useCallback(() => {
    if (projectId) dispatch(fetchKanbanTasks({ projectId, params: {} }));
  }, [dispatch, projectId]);

  useEffect(() => { loadBoard(); }, [loadBoard]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      // Same column reorder
      const newTasks = Array.from(sourceCol.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);
      dispatch(updateColumns({ ...columns, [source.droppableId]: { ...sourceCol, tasks: newTasks } }));
      return;
    }

    // Move between columns
    const sourceTasks = Array.from(sourceCol.tasks);
    const [moved] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(destCol.tasks);
    destTasks.splice(destination.index, 0, { ...moved, status: destination.droppableId });

    dispatch(updateColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks }
    }));

    try {
      await taskService.updateTaskStatus(draggableId, {
        status: destination.droppableId,
        order: destination.index
      });
    } catch {
      toast.error('Failed to update task');
      loadBoard();
    }
  };

  if (isLoading) return <Loader size="lg" text="Loading board..." className="py-20" />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-dark-400 text-sm">Drag and drop tasks to update status</p>
        <Button icon={Plus} size="sm" onClick={() => { setCreateStatus('backlog'); setShowCreate(true); }}>
          Add Task
        </Button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columnOrder.map((colId) => {
            const column = columns[colId];
            if (!column) return null;
            return (
              <div key={colId} className="flex-shrink-0 w-72 bg-dark-800/50 rounded-xl p-3">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-white text-sm">{column.title}</h3>
                  <span className="bg-dark-700 text-dark-400 text-xs px-2 py-0.5 rounded-full">{column.tasks.length}</span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[150px] space-y-2.5 p-1 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-primary-900/20 border-2 border-dashed border-primary-500/50' : ''}`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <TaskCard task={task} isDragging={snapshot.isDragging} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Add Task Button */}
                <button onClick={() => { setCreateStatus(colId); setShowCreate(true); }}
                  className="w-full mt-2 py-2 text-dark-500 hover:text-white hover:bg-dark-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-1">
                  <Plus size={14} /> Add
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={showCreate} onClose={() => setShowCreate(false)} projectId={projectId} defaultStatus={createStatus} onCreated={loadBoard} />
    </div>
  );
};

export default KanbanBoard;
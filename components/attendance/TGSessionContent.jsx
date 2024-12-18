import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'

export function TGSessionContent({
  selectedDate,
  setSelectedDate,
  pointInputs,
  setPointInputs,
  tgSessions
}) {
  const handleAddPoint = () => {
    setPointInputs(current => [...current, { id: Date.now(), value: '' }])
  }

  const handleRemovePoint = (index) => {
    setPointInputs(current => current.filter((_, i) => i !== index))
  }

  const handlePointChange = (index, newValue) => {
    setPointInputs(current =>
      current.map((point, i) =>
        i === index ? { ...point, value: newValue } : point
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>TG Session Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="tg-date" className="text-sm font-medium">Session Date</label>
          <Input
            id="tg-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Points Discussed</h3>
          {pointInputs.map((point, index) => (
            <div key={point.id} className="flex items-center space-x-2">
              <Input
                value={point.value}
                onChange={(e) => handlePointChange(index, e.target.value)}
                placeholder={`Point ${index + 1}`}
              />
              {pointInputs.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePoint(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPoint}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Point
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Previous TG Sessions</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {tgSessions.length > 0 ? (
              tgSessions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((session) => (
                <Card key={session.date} className="p-4">
                  <h4 className="font-medium mb-2">
                    Date: {format(new Date(session.date), 'PP')}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {session.pointsDiscussed.map((point, pointIndex) => (
                      <li key={`${session.date}-point-${pointIndex}`} className="text-sm">
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No previous sessions recorded</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


<script lang="ts">
  import { DatePicker } from 'bits-ui';
  import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';

  export let scheduleDate: Date | null;
  export let scheduleTime: string;
  export let timezone: string;
</script>

<div class="space-y-2">
  <label for="schedule" class="block text-sm font-medium text-gray-700">Schedule For</label>
  <div class="relative flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="relative w-full sm:max-w-[232px]">
        <DatePicker.Root weekdayFormat="short" fixedWeeks={true} bind:value={scheduleDate}>
          <div class="flex w-full flex-col gap-1.5">
            <DatePicker.Input
              class="rounded-lg border border-gray-300 p-2 shadow-sm bg-white text-foreground focus-within:border-gray-300 focus-within:shadow-date-field-focus hover:border-gray-300 flex w-full select-none items-center px-2 py-1 text-sm tracking-[0.01em]"
            >
              {#snippet children({ segments })}
                {#each segments as { part, value }}
                  <div class="inline-block select-none">
                    {#if part === 'literal'}
                      <DatePicker.Segment {part} class="text-muted-foreground p-1">
                        {value}
                      </DatePicker.Segment>
                    {:else}
                      <DatePicker.Segment
                        {part}
                        class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                      >
                        {value}
                      </DatePicker.Segment>
                    {/if}
                  </div>
                {/each}
                <DatePicker.Trigger
                  class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
                >
                  <CalendarBlank class="size-5" />
                </DatePicker.Trigger>
              {/snippet}
            </DatePicker.Input>
            <DatePicker.Content sideOffset={6} class="z-50">
              <DatePicker.Calendar
                class="border border-gray-300 bg-white shadow-popover rounded-[15px] p-[22px]"
              >
                {#snippet children({ months, weekdays })}
                  <DatePicker.Header class="flex items-center justify-between">
                    <DatePicker.PrevButton
                      class="rounded-9px bg-white hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                    >
                      <CaretLeft class="size-6" />
                    </DatePicker.PrevButton>
                    <DatePicker.Heading class="text-[15px] font-medium" />
                    <DatePicker.NextButton
                      class="rounded-9px bg-white hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                    >
                      <CaretRight class="size-6" />
                    </DatePicker.NextButton>
                  </DatePicker.Header>
                  <div
                    class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                  >
                    {#each months as month}
                      <DatePicker.Grid
                        class="w-full border-collapse select-none space-y-1"
                      >
                        <DatePicker.GridHead>
                          <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                            {#each weekdays as day}
                              <DatePicker.HeadCell
                                class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
                              >
                                <div>{day.slice(0, 2)}</div>
                              </DatePicker.HeadCell>
                            {/each}
                          </DatePicker.GridRow>
                        </DatePicker.GridHead>
                        <DatePicker.GridBody>
                          {#each month.weeks as weekDates}
                            <DatePicker.GridRow class="flex w-full">
                              {#each weekDates as date}
                                <DatePicker.Cell
                                  {date}
                                  month={month.value}
                                  class="p-0! relative size-10 text-center text-sm"
                                >
                                  <DatePicker.Day
                                    class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                                  >
                                    <div
                                      class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                                    ></div>
                                    {date.day}
                                  </DatePicker.Day>
                                </DatePicker.Cell>
                              {/each}
                            </DatePicker.GridRow>
                          {/each}
                        </DatePicker.GridBody>
                      </DatePicker.Grid>
                    {/each}
                  </div>
                {/snippet}
              </DatePicker.Calendar>
            </DatePicker.Content>
          </div>
        </DatePicker.Root>
      </div>
      <div class="relative w-full">
        <input
          type="time"
          bind:value={scheduleTime}
          class="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:p-2.5"
        />
      </div>
    </div>
    <div class="flex items-center text-xs text-gray-500 sm:gap-1 sm:text-sm">
      <i class="fa-regular fa-clock" />
      <span>{timezone}</span>
    </div>
  </div>
</div>